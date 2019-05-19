import logging
from pathlib import Path
from typing import Union

import metview
import pandas

logger = logging.getLogger(__name__)


class Geopoints(metview.bindings.Geopoints):
    def __init__(self, path):
        raise PermissionError("Initilizing this class directly is not allowed.")

    @classmethod
    def from_native(cls, path: Union[Path, str]):
        if isinstance(path, Path):
            path = str(path)

        obj = metview.read(path)
        obj.__class__ = cls
        return obj

    @property
    def dataframe(self):
        return pandas.DataFrame.from_records(list(self)).apply(pandas.to_numeric)

    def to_dataframe(self):
        return self.dataframe

    @property
    def values(self):
        return self.dataframe["value"]

    @property
    def latitudes(self):
        return self.dataframe["latitudes"]

    @property
    def longitudes(self):
        return self.dataframe["longitudes"]
