from collections import OrderedDict

import attr
import pandas


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


@attr.s(slots=True)
class ASCIIDecoder(object):
    path = attr.ib()

    @property
    def dataframe(self):
        return pandas.read_csv(
            self.path, comment="#", skip_blank_lines=True, sep=r"\s+"
        )
