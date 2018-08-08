import attr
import pandas

NEW_LINE = '\n'

@attr.s(slots=True)
class ASCII_Table(object):
    output_path = attr.ib()
    dataframe = attr.ib(default=attr.Factory(pandas.DataFrame))
    header = attr.ib(default=None)
    footer = attr.ib(default=None)

    def add_columns_chunk(self, columns):
        if self.dataframe.empty:
            self.dataframe = pandas.DataFrame(columns)
        else:
            self.dataframe.append(
                pandas.DataFrame(columns),
                ignore_index=True
            )

    def write():
        with open(self.output_path, 'w') as f:
            if self.header:
                f.write(self.header)

            f.write(NEW_LINE)
            
            f.write(
                pandas.DataFrame(self.dataframe).to_string()
            )

            f.write(NEW_LINE)

            if self.footer:
                f.write(self.footer)
