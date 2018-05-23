import logging

import attr
from eccodes import (
    codes_grib_new_from_file,
    codes_grib_iterator_new,
    codes_grib_iterator_next,
    codes_set,
    codes_grib_iterator_delete,
    codes_release,
)

from .BaseLoader import BaseLoader

logger = logging.getLogger(__name__)

missingValue = 1e+20  # A value out of range


@attr.s
class GribData(object):
    lat = attr.ib(converter=float)
    lon = attr.ib(converter=float)
    value = attr.ib(converter=float)


class GribLoader(BaseLoader):
    def __init__(self, path):
        self.path = path
        self.items = []
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

                self.items.append(
                    GribData(lat=lat, lon=lon, value=value)
                )

            codes_grib_iterator_delete(iterid)
            codes_release(gid)

    @property
    def values(self):
        return [item.value for item in self.items]

    def validate(self):
        pass
