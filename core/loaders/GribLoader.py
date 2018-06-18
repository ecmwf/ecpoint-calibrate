from __future__ import print_function

import logging
import numpy as np
import os
import tempfile
from functools import partial

import attr
from eccodes import (
    codes_grib_new_from_file,
    codes_grib_iterator_new,
    codes_grib_iterator_next,
    codes_set,
    codes_grib_iterator_delete,
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


@attr.s
class GribPoint(object):
    lat = attr.ib(converter=float)
    lon = attr.ib(converter=float)
    value = attr.ib(converter=float)


class GribPoints(list):
    def __sub__(self, other):
        if not isinstance(other, GribPoints):
            raise ValueError(
                'Subtraction is allowed only between GribPoints objects.'
            )

        result = GribPoints()

        for i, j in zip(self, other):
            if i.lat != j.lat or i.lon != j.lon:
                raise ValueError(
                    'Index mismatch between GRIB points {} and {}'.format(i, j)
                )

            result.append(
                GribPoint(lat=i.lat, lon=i.lon, value=i.value - j.value)
            )

        return result

    def __add__(self, other):
        if not isinstance(other, GribPoints):
            raise ValueError(
                'Addition is allowed only between GribPoints objects.'
            )

        result = GribPoints()

        for i, j in zip(self, other):
            if i.lat != j.lat or i.lon != j.lon:
                raise ValueError(
                    'Index mismatch between GribPoints {} and {}'.format(i, j)
                )

            result.append(
                GribPoint(lat=i.lat, lon=i.lon, value=i.value + j.value)
            )

        return result

    def __mul__(self, other):
        if not isinstance(other, (int, float)):
            raise ValueError(
                'Multiplication is allowed only between GribPoints and int/float objects.'
            )

        result = GribPoints()

        for grib_point in self:
            result.append(
                GribPoint(lat=grib_point.lat, lon=grib_point.lon,
                          value=grib_point.value * other)
            )

        return result

    def __div__(self, other):
        if not isinstance(other, (int, float)):
            raise ValueError(
                'Division is allowed only between GribPoints and int/float objects.'
            )

        result = GribPoints()

        for grib_point in self:
            result.append(
                GribPoint(lat=grib_point.lat, lon=grib_point.lon,
                          value=grib_point.value / other)
            )

        return result

    def __pow__(self, power, modulo=None):
        result = GribPoints()
        for point in self:
            result.append(
                GribPoint(lat=point.lat, lon=point.lon,
                          value=pow(point.value, power))
            )
        return result

    @property
    def values(self):
        return [item.value for item in self]

    @values.setter
    def values(self, values):
        for point, value in zip(self, values):
            point.value = value


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
        self.points = GribPoints()
        # self.read()

    def read(self):
        print('Reading:', self.path)
        with open(self.path) as f:
            gid = codes_grib_new_from_file(f)
            codes_set(gid, "missingValue", missingValue)
            iterid = codes_grib_iterator_new(gid, 0)
            while True:
                result = codes_grib_iterator_next(iterid)
                if not result:
                    break

                [lat, lon, value] = result

                self.points.append(
                    GribPoint(lat=lat, lon=lon, value=value)
                )

            codes_grib_iterator_delete(iterid)
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

    def clone(self):
        tmp_fd, tmp_path = tempfile.mkstemp(suffix='.tmp.grib')
        with os.fdopen(tmp_fd, 'wb') as tmp, open(self.path, 'rb') as f:
            gid = codes_grib_new_from_file(f)
            clone_id = codes_clone(gid)
            codes_write(clone_id, tmp)
            codes_release(clone_id)
            codes_release(gid)

        return type(self)(path=tmp_path)

    @property
    def values(self):
        with open(self.path) as f:
            gid = codes_grib_new_from_file(f)
            result = codes_get_values(gid)
            codes_release(gid)

            return result

    @values.setter
    def values(self, values):
        with open(self.path) as f:
            gid = codes_grib_new_from_file(f)
            codes_set_values(gid, values)
            codes_release(gid)

    def __sub__(self, other):
        values_self = self.values
        values_other = other.values
        clone = self.clone()
        clone.values = values_self - values_other
        return clone

    def __add__(self, other):
        values_self = self.values
        values_other = other.values
        clone = self.clone()
        clone.values = values_self + values_other
        return clone

    def __mul__(self, other):
        # other is a scalar
        values_self = self.values
        clone = self.clone()
        clone.values = values_self * other
        return clone

    def __div__(self, other):
        # other is a scalar
        values_self = self.values
        clone = self.clone()
        clone.values = values_self / other
        return clone

    def __pow__(self, other):
        # other is a scalar
        values_self = self.values
        clone = self.clone()
        print(values_self)
        print(other)
        clone.values = values_self ** other
        return clone

    def __del__(self):
        if self.path.endswith('.tmp.grib'):
            print('REMOVING TEMPORARY GRIB FILE:', self.path)
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
