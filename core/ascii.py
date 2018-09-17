from collections import OrderedDict

import attr
import pandas

NEW_LINE = "\n\n"


@attr.s(slots=True)
class ASCIIEncoder(object):
    path = attr.ib()
    dataframe = attr.ib(default=attr.Factory(pandas.DataFrame))
    header = attr.ib(default=None)
    footer = attr.ib(default=None)

    def add_columns_chunk(self, columns):
        if self.dataframe.empty:
            self.dataframe = pandas.DataFrame.from_dict(OrderedDict(columns))
        else:
            self.dataframe = self.dataframe.append(
                pandas.DataFrame.from_dict(OrderedDict(columns)), ignore_index=True
            )

    def write(self):
        with open(self.path, "w") as f:
            if self.header:
                f.write(self.header)

            f.write(NEW_LINE)

            f.write(self.dataframe.to_string(index=False))

            f.write(NEW_LINE)

            if self.footer:
                f.write(self.footer)


@attr.s(slots=True)
class ASCIIDecoder(object):
    path = attr.ib()

    @property
    def comments(self):
        lines = []
        with open(self.path, 'r') as f:
            while True:
                line = f.readline().strip()
                if line and line.startswith('#'):
                    lines.append(line)
                else:
                    break
        return '\n'.join(lines)


    @property
    def dataframe(self):
        return pandas.read_table(
            self.path, comment="#", skip_blank_lines=True, sep="\s+"
        )
