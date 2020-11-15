from collections import OrderedDict
from dataclasses import dataclass, field
from typing import List, Optional, Union

import attr
import numpy as np
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

from core.loaders import BasePointDataReader


@attr.s(slots=True)
class ParquetPointDataTableWriter:
    # Public attributes
    path = attr.ib()

    # Internal instance attributes
    _metadata = attr.ib(default=None)
    _schema = attr.ib(default=None)
    _is_first_column_written = attr.ib(default=False)
    _pq_writer = attr.ib(default=None)

    @property
    def metadata(self) -> dict:
        return self._metadata

    def add_metadata(self, key: str, value: str) -> None:
        self._metadata = {**(self._metadata or {}), key: value}

    @staticmethod
    def _cast_dataframe(df: pd.DataFrame) -> pd.DataFrame:
        date_columns = ("BaseDate", "DateOBS")
        int_columns = ("BaseTime", "TimeOBS", "StepF" if "StepF" in df else "Step")
        float_columns = df.select_dtypes(include=[np.float]).columns.to_list()

        for col in date_columns:
            df[col] = df[col].astype("category")

        for col in int_columns:
            df[col] = pd.to_numeric(df[col], downcast="unsigned")

        for col in float_columns:
            df[col] = pd.to_numeric(df[col], downcast="float")

        return df

    def append(self, dataframe: pd.DataFrame) -> None:
        dataframe = self._cast_dataframe(dataframe)

        if not self._is_first_column_written:
            # Infer DataFrame schema from the first chunk.
            table = pa.Table.from_pandas(dataframe)

            if self.metadata:
                table = table.replace_schema_metadata(self.metadata)

            # Save schema for future append() calls.
            self._schema = table.schema

            self._pq_writer = pq.ParquetWriter(f"{self.path}", self._schema)
            self._is_first_column_written = True
        else:
            table = pa.Table.from_pandas(dataframe, self._schema)

        self._pq_writer.write_table(table)

    def close(self):
        if self._pq_writer:
            self._pq_writer.close()
            self._pq_writer = None

    # +----------------------------------------------------------+
    # | Compatibility methods to follow the API of ASCIIEncoder. |
    # +----------------------------------------------------------+
    def add_columns_chunk(self, columns):
        df = pd.DataFrame.from_dict(OrderedDict(columns))
        return self.append(df)

    def add_header(self, header):
        return self.add_metadata("header", header)

    def add_footer(self, footer):
        return self.add_metadata("footer", footer)


@dataclass
class ParquetPointDataTableReader(BasePointDataReader):
    # Internal instance attributes
    _columns: Optional[list] = field(default=None, repr=False)
    _metadata: Optional[dict] = field(default=None, repr=False)
    _dataframe: Optional[pd.DataFrame] = field(default=None, repr=False)

    # Fields for implementing the iterator protocol
    _current_row_group: int = field(default=0, repr=False)

    @property
    def columns(self) -> List[str]:
        if not self._columns:
            pq_reader = pq.ParquetFile(self.path)
            self._columns = pq_reader.schema.names

        return self._columns

    @property
    def dataframe(self) -> pd.DataFrame:
        if self._dataframe is None:
            self._dataframe = pd.read_parquet(self.path, engine="pyarrow")

        return self._dataframe

    @property
    def metadata(self) -> dict:
        if not self._metadata:
            pq_reader = pq.ParquetFile(self.path)
            raw_metadata = pq_reader.schema_arrow.metadata

            self._metadata = {k.decode(): v.decode() for k, v in raw_metadata.items()}

        return self._metadata

    def select(self, *args: str, series: bool = True) -> Union[pd.DataFrame, pd.Series]:
        result = pd.read_parquet(self.path, engine="pyarrow", columns=list(args))
        if series and len(args) == 1:
            (col,) = args
            result = result[col]
        return result

    def __iter__(self) -> "ParquetPointDataTableReader":
        self._current_row_group = 0
        return self

    def __next__(self) -> pd.DataFrame:
        pq_reader = pq.ParquetFile(self.path)

        if self._current_row_group == pq_reader.num_row_groups:
            raise StopIteration

        table = pq_reader.read_row_group(self._current_row_group)
        self._current_row_group += 1
        return table.to_pandas()
