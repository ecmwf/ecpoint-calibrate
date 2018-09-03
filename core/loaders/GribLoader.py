from __future__ import print_function

import logging
import os
import tempfile
from contextlib import contextmanager
from functools import partial

import attr
import numpy as np
import pandas
from eccodes import (
    codes_clone,
    codes_get,
    codes_get_values,
    codes_grib_find_nearest,
    codes_grib_iterator_delete,
    codes_grib_iterator_new,
    codes_grib_iterator_next,
    codes_grib_new_from_file,
    codes_release,
    codes_set,
    codes_set_values,
    codes_write,
)

from .BaseLoader import BasePredictorLoader
from .generics import Point
from .utils import poolcontext

logger = logging.getLogger(__name__)

missingValue = 1e+20  # A value out of range


def nearest_value_func(gid, args):
    lat, lon = args
    nearest = codes_grib_find_nearest(gid, lat, lon)[0]
    return lat, lon, nearest.value


@contextmanager
def load_grib(path):
    f = open(path)
    gid = codes_grib_new_from_file(f)
    yield gid
    codes_release(gid)
    f.close()


@attr.s
class GribLoader(object):
    path = attr.ib()

    @path.validator
    def _check_path(self, attribute, value):
        if not os.path.exists(value):
            raise IOError

    @property
    def dataframe(self):
        records = []

        with load_grib(self.path) as gid:
            iterid = codes_grib_iterator_new(gid, 0)
            while True:
                result = codes_grib_iterator_next(iterid)
                if not result:
                    break

                lat, lon, value = result

                records.append((lat, lon, value))

            codes_grib_iterator_delete(iterid)

        return pandas.DataFrame.from_records(records, columns=["lat", "lon", "value"])

    def nearest_gridpoint__naive(self, geopoints):
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
        df = self.dataframe.to_records(index=False)
        result = []

        for _, row in geopoints.dataframe.iterrows():
            point = Point(lat=row["lat"], lon=row["lon"])
            nearest = min(
                df, key=lambda p: point.distance_from(Point(lat=p[0], lon=p[1]))
            )
            result.append((point.lat, point.lon, nearest[2]))

        return pandas.DataFrame.from_records(result, columns=["lat", "lon", "value"])

    def nearest_gridpoint__eccodes(self, geopoints):
        with poolcontext() as pool, load_grib(self.path) as gid:
            result = pool.map(
                partial(nearest_value_func, gid),
                geopoints.dataframe[["lat", "lon"]].to_records(index=False),
            )

        return pandas.DataFrame.from_records(result, columns=["lat", "lon", "value"])

    nearest_gridpoint = nearest_gridpoint__eccodes

    @property
    def values(self):
        """
        Property to access the values key of the GRIB file as a numpy
        array.

        :rtype: numpy.ndarray
        """
        with load_grib(self.path) as gid:
            result = codes_get_values(gid)

        return result

    @values.setter
    def values(self, values):
        raise NotImplementedError

    def clone_with_new_values(self, values):
        tmp_fd, tmp_path = tempfile.mkstemp(suffix=".tmp.grib")
        with os.fdopen(tmp_fd, "wb") as tmp, load_grib(self.path) as gid:
            clone_id = codes_clone(gid)

            # Use single-precision floating-point representation
            codes_set(clone_id, "bitsPerValue", 32)

            codes_set_values(clone_id, values)

            codes_write(clone_id, tmp)

            codes_release(clone_id)

        return type(self)(tmp_path)

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
        if self.path.endswith(".tmp.grib"):
            logger.debug("Remove temporary GRIB file: " + self.path)
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
