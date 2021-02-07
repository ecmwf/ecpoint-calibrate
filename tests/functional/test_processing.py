import tempfile

import pytest
from pandas.testing import assert_frame_equal

from core.loaders import ErrorType, load_point_data_by_path


@pytest.mark.parametrize("fmt", ("ASCII", "PARQUET"))
def test_alfa(client, alfa_cassette, alfa_loader, fmt):
    with tempfile.NamedTemporaryFile("w", suffix=f".{fmt.lower()}", delete=True) as f:
        request = alfa_cassette(output_path=f.name, fmt=fmt)
        response = client.post("/computation-logs", json=request)
        assert response.status_code == 200

        got_loader = load_point_data_by_path(path=f.name)
        assert got_loader.error_type == ErrorType.FER

        want_loader = alfa_loader(fmt="ASCII")

        assert got_loader.columns == want_loader.columns

        assert_frame_equal(
            got_loader.dataframe,
            want_loader.dataframe,
            check_dtype=False,
            check_categorical=False,
        )
