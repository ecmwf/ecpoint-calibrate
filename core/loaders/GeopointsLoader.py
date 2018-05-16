from datetime import datetime, time

import attr

from .BaseLoader import BaseLoader


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


class GeopointsLoader(BaseLoader):
    HEADER = ['lat', 'lon', 'height', 'date', 'time', 'value']

    def __init__(self, path):
        self.path = path

    def read(self):
        with open(self.path) as f:
            f.readline()
            f.readline()
            f.readline()
            f.readline()

            for line in f:
                lat, lon, height, date, time, value = line.strip().split()
                yield Geopoint(lat, lon, height, date, time, value)

    def validate(self):
        with open(self.path) as f:
            l1 = f.readline().lstrip('#').strip()
            l2 = f.readline().lstrip('#').strip()
            l3 = f.readline()
            l4 = f.readline().lstrip('#').strip()

            if (
                    l1 == 'GEO' and
                    l2.split() == self.HEADER and
                    l3.startswith('#') and
                    l4 == 'DATA'
            ):
                # OK
                pass
            else:
                raise ValueError('Corrupt Geopoint file')
