import os

from core.loaders.GeopointsLoader import GeopointsLoader

TEST_DATA_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 'data'
)


def test_geopoints_loader_header_ok():
    loader = GeopointsLoader(os.path.join(TEST_DATA_DIR, 'good_geo_file.geo'))

    assert len(loader.geopoints) == 2

    loader = GeopointsLoader(os.path.join(TEST_DATA_DIR, 'good_geo_file_with_multiline_comments.geo'))

    assert len(loader.geopoints) == 2


def test_geopoints_loader_values_ok():
    loader = GeopointsLoader(os.path.join(TEST_DATA_DIR, 'good_geo_file.geo'))
    assert len(loader.values) == 2
    assert loader.values == [0.0, 0.0]
