import os

from core.loaders.GeopointsLoader import GeopointsLoader

TEST_DATA_DIR = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), 'data'
)


def test_geopoints_loader_header_ok():
    loader = GeopointsLoader(os.path.join(TEST_DATA_DIR, 'good_geo_file.geo'))
    loader.validate()

    assert len(list(loader.read())) == 2

    loader = GeopointsLoader(os.path.join(TEST_DATA_DIR, 'good_geo_file_with_multiline_comments.geo'))
    loader.validate()

    assert len(list(loader.read())) == 2