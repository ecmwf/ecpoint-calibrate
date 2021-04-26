import abc
import re
from dataclasses import dataclass
from enum import Enum
from typing import List, Union

import pandas as pd


class ErrorType(Enum):
    FE = 1
    FER = 2

    def bias(self, error: pd.Series, low: float, high: float) -> float:
        mask = error.between(low, high, inclusive=True)
        error = error[mask]

        mean = error.mean()
        return (1 + mean) if self == self.FER else mean


@dataclass
class BasePointDataReader(abc.ABC):
    path: str
    cheaper: bool = False

    @property
    @abc.abstractmethod
    def dataframe(self) -> pd.DataFrame:
        raise NotImplementedError

    @property
    @abc.abstractmethod
    def metadata(self) -> dict:
        raise NotImplementedError

    @property
    def units(self) -> dict:
        header = self.metadata["header"]

        predictand_idx = header.find("# PREDICTAND")
        predictors_idx = header.find("# PREDICTORS")
        obs_idx = header.find("# OBSERVATIONS")

        predictand_text = header[predictand_idx:predictors_idx]
        predictors_text = header[predictors_idx:obs_idx]
        obs_text = header[obs_idx:]

        m = re.search(r"Variable\W+= (.*) \(in (.*)\)", predictand_text)
        predictand = {m.group(1): m.group(2)} if m else {}

        predictors = dict(re.findall(r", (.*) \[(.*)]", predictors_text))

        m = re.search(r"Parameter\W+= (.*) \(in (.*)\)", obs_text)
        obs = {m.group(1): m.group(2)} if m else {}

        return {
            "predictors": {
                k: v.replace("NoUnit", "") or None for k, v in predictors.items()
            },
            "observations": obs,
            "predictand": predictand,
        }

    @property
    @abc.abstractmethod
    def columns(self) -> List[str]:
        raise NotImplementedError

    @abc.abstractmethod
    def select(self, *args: str, series: bool = True) -> Union[pd.DataFrame, pd.Series]:
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
    def __next__(self) -> pd.DataFrame:
        raise NotImplementedError

    @property
    def predictors(self) -> List[str]:
        fields = set(self.columns) - {
            "BaseDate",
            "BaseTime",
            "StepF",
            "Step",
            "DateOBS",
            "TimeOBS",
            "LatOBS",
            "LonOBS",
            "OBS",
            "Predictand",
            "FER",
            "FE",
        }

        return list(fields)


def load_point_data_by_path(path: str, cheaper: bool = False) -> BasePointDataReader:
    from core.loaders.ascii import ASCIIDecoder
    from core.loaders.parquet import ParquetPointDataTableReader

    if path.endswith(".ascii") or path.endswith(".csv"):
        loader = ASCIIDecoder(path=path, cheaper=cheaper)
    elif path.endswith(".parquet"):
        loader = ParquetPointDataTableReader(path=path, cheaper=cheaper)
    else:
        raise ValueError(f"invalid file extension: {path}")

    print(f"Loaded point data table: {loader}")
    return loader
