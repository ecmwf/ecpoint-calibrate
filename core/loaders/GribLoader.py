from __future__ import print_function

import logging
import os
import tempfile
from functools import partial

import numpy as np
from eccodes import (
    codes_grib_new_from_file,
    codes_release,
    codes_grib_find_nearest,
    codes_clone,
    codes_write,
    codes_get_values,
    codes_set_values,
    codes_set,
)

from .BaseLoader import BasePredictorLoader
from .GeopointsLoader import Geopoints, Geopoint
from .utils import poolcontext

logger = logging.getLogger(__name__)

missingValue = 1e+20  # A value out of range


def nearest_value_func(gid, geopoint):
    nearest = codes_grib_find_nearest(
        gid, geopoint.lat, geopoint.lon
    )[0]

    return Geopoint(
        lat=geopoint.lat,
        lon=geopoint.lon,
        height=geopoint.height,
        date=geopoint.date,
        time=geopoint.time,
        value=nearest.value
    )


class GribLoader(BasePredictorLoader):
    def __init__(self, path):
        if not os.path.exists(path):
            raise IOError

        self.path = path

    def nearest_gridpoint(self, geopoints):
        """
        Instance method to take a list of observation geopoints and match the
        forecast in the GRIB data for the nearest grid-point.

        Returns a Geopoints instance with the same length of `geopoints` but
        containing the forecast values.

        :param geopoints: (Geopoints | List[Geopoint] | GeopointsLoader) An
            iterable sequence of the observations.

        :return: Geopoints instance containing list of geopoint values from
            the forecast data.
        :rtype: Geopoints
        """
        with open(self.path) as f:
            gid = codes_grib_new_from_file(f)

            with poolcontext() as pool:
                result = pool.map(
                    partial(nearest_value_func, gid),
                    geopoints
                )

        return Geopoints(result)

    @property
    def values(self):
        """
        Property to access the values key of the GRIB file as a numpy
        array.

        :rtype: numpy.ndarray
        """
        with open(self.path, 'rb') as f:
            gid = codes_grib_new_from_file(f)
            result = codes_get_values(gid)
            codes_release(gid)

        return result

    @values.setter
    def values(self, values):
        raise NotImplementedError

    def clone_with_new_values(self, values):
        tmp_fd, tmp_path = tempfile.mkstemp(suffix='.tmp.grib')
        with os.fdopen(tmp_fd, 'wb') as tmp, open(self.path, 'rb') as f:
            gid = codes_grib_new_from_file(f)
            clone_id = codes_clone(gid)

            # Use single-precision floating-point representation
            codes_set(clone_id, 'bitsPerValue', 32)

            codes_set_values(clone_id, values)

            codes_write(clone_id, tmp)

            codes_release(clone_id)
            codes_release(gid)

        return type(self)(
            tmp_path
        )

    def __sub__(self, other):
        """
        Magic method to implement subtraction between two `GribLoader`
        instances.

        Only the `values` key of the GRIB fields are subtracted, and the rest
        of the keys are copied from `self` as-is.

        :param other: (GribLoader) If (A - B) is performed, then B is the
            `other` instance.

        :return: New `GribLoader` instance containing the subtracted values.
        :rtype: GribLoader
        """
        values = self.values - other.values
        return self.clone_with_new_values(values)

    def __add__(self, other):
        """
        Magic method to implement addition between two `GribLoader`
        instances.

        Only the `values` key of the GRIB fields are added, and the rest
        of the keys are copied from `self` as-is.

        :param other: (GribLoader) If (A + B) is performed, then B is the
            `other` instance.

        :return: New `GribLoader` instance containing the added values.
        :rtype: GribLoader
        """
        values = self.values + other.values
        return self.clone_with_new_values(values)

    def __mul__(self, other):
        """
        Magic method to implement multiplication between a `GribLoader`
        instance and a scalar value.

        Only the `values` key of the GRIB fields are multiplied with the
        scalar, and the rest of the keys are copied from `self` as-is.

        :param other: (int|float) If (A * s) is performed, then s is the
            `other` value.

        :return: New `GribLoader` instance containing the multiplied values.
        :rtype: GribLoader
        """
        values = self.values * other
        return self.clone_with_new_values(values)

    def __div__(self, other):
        """
        Magic method to implement division between a `GribLoader`
        instance and a scalar value.

        Only the `values` key of the GRIB fields are divided by the
        scalar, and the rest of the keys are copied from `self` as-is.

        :param other: (int|float) If (A / s) is performed, then s is the
            `other` value.

        :return: New `GribLoader` instance containing the divided values.
        :rtype: GribLoader
        """
        values = self.values / other
        return self.clone_with_new_values(values)

    def __pow__(self, other):
        """
        Magic method to implement `GribLoader` instance raised to the power of
        a scalar value.

        Only the `values` key of the GRIB fields are raised to the power of the
        scalar, and the rest of the keys are copied from `self` as-is.

        [XXX] - The low-level API for handling GRIB data is unable to handle
        large values (greater than 2) or values with high-precision. Use with
        caution.

        :param other: (int|float) If (A * s) is performed, then s is the
            `other` value.

        :return: New `GribLoader` instance containing the multiplied values.
        :rtype: GribLoader
        """
        values = self.values ** other
        return self.clone_with_new_values(values)

    def __del__(self):
        if self.path.endswith('.tmp.grib'):
            logger.debug('Remove temporary GRIB file: ' + self.path)
            os.remove(self.path)

    def validate(self):
        pass

    @classmethod
    def rms(cls, *args):
        """
        classmethod to compute the root mean square value of sequence of
        GribLoader instances.

        :param args: (Tuple[GribLoader]) Sequence of GribLoader instances.
        :return: New `GribLoader` instance containing the root mean square
            value.
        :rtype: GribLoader
        """
        if len(args) == 0:
            raise Exception

        term_1 = args[0]

        sum_squared_values = sum(abs(term.values) ** 2 for term in args)
        mean_squared_values = sum_squared_values / 2.0

        values = np.sqrt(mean_squared_values)
        return term_1.clone_with_new_values(values)
