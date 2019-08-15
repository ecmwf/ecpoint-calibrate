from core.loaders.geopoints import read_geopoints
from tests.conf import TEST_DATA_DIR


def test_geopoints_loader_header_ok():
    loader = read_geopoints(TEST_DATA_DIR / "good_geo_file.geo")

    assert len(loader) == 2

    loader = read_geopoints(TEST_DATA_DIR / "good_geo_file_with_multiline_comments.geo")

    assert len(loader) == 2


def test_geopoints_loader_values_ok():
    loader = read_geopoints(TEST_DATA_DIR / "good_geo_file.geo")
    assert loader.values().tolist() == [0.0, 0.0]
