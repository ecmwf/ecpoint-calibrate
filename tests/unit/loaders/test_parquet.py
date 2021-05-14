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

    assert metadata == {"header": "foo", "footer": "bar"}
    assert df.memory_usage(deep=True).sum() > df_pq.memory_usage(deep=True).sum()

    assert_frame_equal(df_pq, df, check_dtype=False, check_categorical=False)


def test_good_parquet_file_clone(tmp_path):
    path = TEST_DATA_DIR / "good_parquet.ascii"
    df = ASCIIDecoder(path=path).dataframe

    with NamedTemporaryFile() as f:
        w = ParquetPointDataTableWriter(f.name)
        w.add_columns_chunk(df.copy())
        w.close()

        r = ParquetPointDataTableReader(f.name)
        exclude_cols = ["tp_acc", "cape_wa"]
        cloned_path = tmp_path / "good_parquet.parquet"
        cols = [col for col in r.columns if col not in exclude_cols]
        r.clone(*cols, path=cloned_path)

        cloned_data = ParquetPointDataTableReader(cloned_path)

        assert_frame_equal(
            cloned_data.dataframe,
            df.drop(exclude_cols, axis=1),
            check_dtype=False,
            check_categorical=False,
        )
