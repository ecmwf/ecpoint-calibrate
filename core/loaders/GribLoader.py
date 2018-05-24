import logging

import attr
from eccodes import (
    codes_grib_new_from_file,
    codes_grib_iterator_new,
    codes_grib_iterator_next,
    codes_set,
    codes_grib_iterator_delete,
    codes_release,
    codes_grib_find_nearest,
)

from .BaseLoader import BaseLoader

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
                GribPoint(lat=grib_point.lat, lon=grib_point.lon, value=grib_point.value * other)
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
                GribPoint(lat=grib_point.lat, lon=grib_point.lon, value=grib_point.value / other)
            )

        return result

    def __pow__(self, power, modulo=None):
        result = GribPoints()
        for point in self:
            result.append(
                GribPoint(lat=point.lat, lon=point.lon, value=pow(point.value, power))
            )
        return result

    @property
    def values(self):
        return [item.value for item in self]

    @values.setter
    def values(self, values):
        for point, value in zip(self, values):
            point.value = value


class GribLoader(BaseLoader):
    def __init__(self, path):
        self.path = path
        self.points = GribPoints()
        self.read()

    def read(self):
        logger.info('Reading: ' + self.path)
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
            result = GribPoints()
            for geopoint in geopoints:
                nearest = codes_grib_find_nearest(gid, geopoint.lat, geopoint.lon)[0]
                result.append(
                    GribPoint(nearest.lat, nearest.lon, nearest.value)
                )
            codes_release(gid)
        return result

    def validate(self):
        pass
