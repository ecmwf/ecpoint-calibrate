from core.loaders.geopoints import Geopoints
from tests.conf import TEST_DATA_DIR


def test_geopoints_loader_header_ok():
    loader = Geopoints.from_native(TEST_DATA_DIR / "good_geo_file.geo")

    assert len(loader.values) == 2

    loader = Geopoints.from_native(
        TEST_DATA_DIR / "good_geo_file_with_multiline_comments.geo"
    )

    assert len(loader.values) == 2


def test_geopoints_loader_values_ok():
    loader = Geopoints.from_native(TEST_DATA_DIR / "good_geo_file.geo")
    assert len(loader.values) == 2
    assert loader.values.tolist() == [0.0, 0.0]
