import logging
from datetime import datetime, time

import attr

import numpy

from .BaseLoader import BaseLoader

logger = logging.getLogger(__name__)


def convert_str_to_py_date(string):
    return datetime.strptime(
        string, '%Y%m%d'
    ).date()


def convert_str_to_py_time(string):
    string = string.zfill(4)
    hour, minute = int(string[:2]), int(string[2:])
    carry_hours, minute = divmod(minute, 60)
    hour += carry_hours
    return time(hour=hour, minute=minute)


@attr.s
class Geopoint(object):
    lat = attr.ib(converter=float)
    lon = attr.ib(converter=float)
    height = attr.ib(converter=float)
    date = attr.ib(converter=convert_str_to_py_date)
    time = attr.ib(converter=convert_str_to_py_time)
    value = attr.ib(converter=float)

    @property
    def datetime(self):
        return datetime.combine(
            self.date, self.time
        )


class Geopoints(list):
    @property
    def values(self):
        return numpy.array(geopoint.value for geopoint in self)

    @property
    def latitudes(self):
        return numpy.array(geopoint.lat for geopoint in self)

    @property
    def longitudes(self):
        return numpy.array(geopoint.lon for geopoint in self)

    def __sub__(self, other):
        return type(self)(
            Geopoint(
                lat=point_self.lat, lon=point_self.lon, time=point_self.time,
                height=point_self.height, date=point_self.date,
                value=point_self.value - point_other.value
            )
            for point_self, point_other in zip(self, other)
        )

    def __div__(self, other):
        return type(self)(
            Geopoint(
                lat=point_self.lat, lon=point_self.lon, time=point_self.time,
                height=point_self.height, date=point_self.date,
                value=point_self.value / point_other.value
            )
            for point_self, point_other in zip(self, other)
        )


class GeopointsLoader(BaseLoader):
    HEADER = ['lat', 'lon', 'height', 'date', 'time', 'value']

    def __init__(self, path):
        self.path = path
        self.geopoints = Geopoints()
        self.validate()
        self.read()

    def read(self):
        logger.info('Reading: ' + self.path)

        with open(self.path) as f:
            f.readline()
            f.readline()

            while True:
                raw_data = f.readline()
                if not raw_data.strip() or raw_data.lstrip('#').strip() == 'DATA':
                    break

            for line in f:
                lat, lon, height, date, time, value = line.strip().split()
                self.geopoints.append(
                    Geopoint(lat, lon, height, date, time, value)
                )

    @property
    def values(self):
        return self.geopoints.values

    def validate(self):
        with open(self.path) as f:
            l1 = f.readline().lstrip('#').strip()
            l2 = f.readline().lstrip('#').strip()
            while True:
                raw_data = f.readline()
                if not raw_data.strip():
                    data = ''
                    break
                if raw_data.lstrip('#').strip() == 'DATA':
                    data = 'DATA'
                    break

            if (
                    l1 == 'GEO' and
                    l2.split() == self.HEADER and
                    data == 'DATA'
            ):
                # OK
                pass
            else:
                raise ValueError('Corrupt Geopoint file')
