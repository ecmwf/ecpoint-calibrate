import abc
from dataclasses import dataclass
from typing import List, Type

import pandas


@dataclass
class BasePointDataReader(abc.ABC):
    path: str

    @property
    @abc.abstractmethod
    def dataframe(self) -> pandas.DataFrame:
        raise NotImplementedError

    @property
    @abc.abstractmethod
    def columns(self) -> List[str]:
        raise NotImplementedError

    @abc.abstractmethod
    def select(self, *args):
        raise NotImplementedError


def load_point_data_by_path(path: str) -> BasePointDataReader:
    from core.loaders.ascii import ASCIIDecoder
    from core.loaders.parquet import ParquetPointDataTableReader

    if path.endswith(".ascii"):
        return ASCIIDecoder(path=path)
    elif path.endswith(".parquet"):
        return ParquetPointDataTableReader(path=path)
