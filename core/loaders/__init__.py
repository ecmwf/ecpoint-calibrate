import abc
from dataclasses import dataclass
from enum import Enum
from typing import List

import pandas


class ErrorType(Enum):
    FE = 1
    FER = 2


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
    def select(self, *args: str) -> pandas.DataFrame:
        raise NotImplementedError

    @property
    def error_type(self) -> ErrorType:
        """
        Returns an ErrorType enum indicating whether the point data table
        contains a Forecast Error Ratio (FER) or Forecast Error (FE).

        For optimal performance, self.columns should cache outputs in the
        derived classes.
        """
        return ErrorType.FER if ErrorType.FER.name in self.columns else ErrorType.FE

    @abc.abstractmethod
    def __iter__(self):
        raise NotImplementedError

    @abc.abstractmethod
    def __next__(self) -> pandas.DataFrame:
        raise NotImplementedError


def load_point_data_by_path(path: str) -> BasePointDataReader:
    from core.loaders.ascii import ASCIIDecoder
    from core.loaders.parquet import ParquetPointDataTableReader

    if path.endswith(".ascii"):
        return ASCIIDecoder(path=path)
    elif path.endswith(".parquet"):
        return ParquetPointDataTableReader(path=path)
