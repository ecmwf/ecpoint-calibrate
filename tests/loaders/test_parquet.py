from tempfile import NamedTemporaryFile

from pandas.testing import assert_frame_equal

from core.loaders.ascii import ASCIIDecoder
from core.loaders.parquet import (
    ParquetPointDataTableReader,
    ParquetPointDataTableWriter,
)
from tests.conf import TEST_DATA_DIR


def test_good_parquet_file():
    path = TEST_DATA_DIR / "good_parquet.ascii"

    df = ASCIIDecoder(path=path).dataframe

    with NamedTemporaryFile() as f:
        w = ParquetPointDataTableWriter(f.name)
        w.add_metadata("header", "foo")
        w.add_metadata("footer", "bar")
        w.append(df.copy())
        w.close()

        r = ParquetPointDataTableReader(f.name)
        metadata = r.metadata
        df_pq = r.dataframe

    assert metadata == {b"header": b"foo", b"footer": b"bar"}
    assert df.memory_usage(deep=True).sum() > df_pq.memory_usage(deep=True).sum()

    assert_frame_equal(df_pq, df, check_dtype=False, check_categorical=False)
