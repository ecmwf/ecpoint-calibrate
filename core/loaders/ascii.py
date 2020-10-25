from collections import OrderedDict
from functools import partial
from typing import List

import attr
import pandas

from core.loaders import BasePointDataReader


@attr.s(slots=True)
class ASCIIEncoder(object):
    path = attr.ib()
    first_chunk_address_added = attr.ib(default=False)

    def add_header(self, header):
        with open(self.path, "w") as f:
            f.write(header)
            f.write("\n\n")

    def add_footer(self, footer):
        with open(self.path, "a") as f:
            f.write(footer)

    def add_columns_chunk(self, columns):
        df = pandas.DataFrame.from_dict(OrderedDict(columns))

        with open(self.path, "a") as f:
            if not self.first_chunk_address_added:
                f.write(df.to_string(index=False, col_space=10))
                self.first_chunk_address_added = True
            else:
                f.write(df.to_string(index=False, header=False, col_space=10))
            f.write("\n")


class ASCIIDecoder(BasePointDataReader):
    @property
    def _reader(self):
        return partial(
            pandas.read_csv, self.path, comment="#", skip_blank_lines=True, sep=r"\s+"
        )

    @property
    def dataframe(self):
        return self._reader()

    @property
    def columns(self) -> List[str]:
        df = self._reader(nrows=0)
        return list(df.columns)

    def select(self, *args):
        return self._reader(usecols=args)
