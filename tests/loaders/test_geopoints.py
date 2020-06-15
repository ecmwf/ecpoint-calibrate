from core.loaders.geopoints import read_geopoints, get_geopoints_values
from tests.conf import TEST_DATA_DIR


def test_geopoints_loader_header_ok():
    loader = read_geopoints(TEST_DATA_DIR / "good_geo_file.geo")

    assert len(loader) == 2

    loader = read_geopoints(TEST_DATA_DIR / "good_geo_file_with_multiline_comments.geo")

    assert len(loader) == 2


def test_geopoints_loader_values_ok():
    loader = read_geopoints(TEST_DATA_DIR / "good_geo_file.geo")
    assert get_geopoints_values(loader).tolist() == [0.0, 0.0]


def test_geopoints_loader_new_format_ok():
    loader = read_geopoints(TEST_DATA_DIR / "new_geo_file_format.geo")
    assert len(loader) == 4
    assert get_geopoints_values(loader).tolist() == [0.9, 0.3, 0.1, 0.9]
