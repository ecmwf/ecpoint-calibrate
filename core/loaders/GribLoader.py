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
)

from .BaseLoader import BaseLoader
from .GeopointsLoader import Geopoints, Geopoint
from ..utils import poolcontext

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


class GribLoader(BaseLoader):
    def __init__(self, path):
        self.path = path

        with open(path, 'rb') as f:
            gid = codes_grib_new_from_file(f)
            self.__values = codes_get_values(gid)
            codes_release(gid)

    def nearest_gridpoint(self, geopoints):
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
        return self.__values

    @values.setter
    def values(self, values):
        if not isinstance(values, np.ndarray):
            raise TypeError

        tmp_fd, tmp_path = tempfile.mkstemp(suffix='.tmp.grib')
        with os.fdopen(tmp_fd, 'wb') as tmp, open(self.path, 'rb') as f:
            gid = codes_grib_new_from_file(f)
            clone_id = codes_clone(gid)

            codes_write(clone_id, tmp)
            codes_set_values(clone_id, values)
            self.__values = values
            self.path = tmp_path

            codes_release(clone_id)
            codes_release(gid)

    def __sub__(self, other):
        self.values = self.values - other.values
        return self

    def __add__(self, other):
        self.values = self.values + other.values
        return self

    def __mul__(self, other):
        # other is a scalar
        self.values = self.values * other
        return self

    def __div__(self, other):
        # other is a scalar
        self.values = self.values / other
        return self

    def __pow__(self, other):
        # other is a scalar
        self.values = self.values ** other
        return self

    def __del__(self):
        if self.path.endswith('.tmp.grib'):
            logger.debug('Remove temporary GRIB file: ' + self.path)
            os.remove(self.path)

    def validate(self):
        pass

    @classmethod
    def rms(cls, *args):
        if len(args) == 0:
            raise Exception

        term_1 = args[0]
        clone = term_1.clone()

        sum_squared_values = sum(abs(term.values) ** 2 for term in args)
        mean_squared_values = sum_squared_values / 2.0

        clone.values = np.sqrt(mean_squared_values)
        return clone
