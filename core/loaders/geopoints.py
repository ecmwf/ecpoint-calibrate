import logging

import attr
import pandas

logger = logging.getLogger(__name__)


@attr.s(slots=True, repr=False)
class GeopointsLoader(object):
    HEADER = ["lat", "lon", "height", "date", "time", "value"]

    path = attr.ib()

    dataframe = attr.ib(init=False)

    @dataframe.default
    def _init_df(self):
        self.validate()
        return self.read()

    def __repr__(self):
        return repr(self.dataframe)

    def read(self):
        logger.info("Reading: " + self.path)

        with open(self.path) as f:
            f.readline()
            f.readline()

            records = []

            while True:
                raw_data = f.readline()
                if not raw_data.strip() or raw_data.lstrip("#").strip() == "DATA":
                    break

            for line in f:
                lat, lon, _, _, _, value = line.strip().split()
                records.append((lat, lon, value))

        return pandas.DataFrame.from_records(
            records, columns=["lat", "lon", "value"]
        ).apply(pandas.to_numeric)

    def __len__(self):
        return len(self.dataframe)

    @property
    def values(self):
        return self.dataframe["value"]

    @property
    def latitudes(self):
        return self.dataframe["lat"]

    @property
    def longitudes(self):
        return self.dataframe["lon"]

    def validate(self):
        with open(self.path) as f:
            l1 = f.readline().lstrip("#").strip()
            l2 = f.readline().lstrip("#").strip()
            while True:
                raw_data = f.readline()
                if not raw_data.strip():
                    data = ""
                    break
                if raw_data.lstrip("#").strip() == "DATA":
                    data = "DATA"
                    break

            if l1 == "GEO" and l2.split() == self.HEADER and data == "DATA":
                # OK
                pass
            else:
                raise ValueError("Corrupt Geopoint file")
