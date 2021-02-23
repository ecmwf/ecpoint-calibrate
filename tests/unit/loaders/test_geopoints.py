import textwrap

import pytest

from core.loaders import geopoints as geopoints_loader
from tests.conf import TEST_DATA_DIR


def test_geopoints_loader_header_ok():
    loader = geopoints_loader.read(TEST_DATA_DIR / "good_geo_file.geo")

    assert len(loader) == 2

    loader = geopoints_loader.read(
        TEST_DATA_DIR / "good_geo_file_with_multiline_comments.geo"
    )

    assert len(loader) == 2


def test_geopoints_loader_values_ok():
    loader = geopoints_loader.read(TEST_DATA_DIR / "good_geo_file.geo")
    assert geopoints_loader.get_values(loader).tolist() == [0.0, 0.0]


def test_geopoints_loader_new_format_ok():
    loader = geopoints_loader.read(TEST_DATA_DIR / "new_geo_file_format.geo")
    assert len(loader) == 4
    assert geopoints_loader.get_values(loader).tolist() == [0.9, 0.3, 0.1, 0.9]


def test_geopoints_units_ok(tmp_path):
    path = tmp_path / "file.geo"
    path.write_text(
        textwrap.dedent(
            """
            #GEO
            #FORMAT NCOLS
            #COLUMNS
            stnid	latitude	longitude	level	date	time	elevation	value_0
            # Missing values represented by 3e+38 (not user-changeable)
            #METADATA
            date=20190101
            k=43200
            step=0
            time=0000
            units=mm
            #DATA
            21921	70.68	127.4	0	20190101	0	33	0.9
            6370	51.45	5.38	0	20190101	0	22	0.3
            """
        ).strip()
    )

    units = geopoints_loader.read_units(path)
    assert units == "mm"


def test_geopoints_units_missing_metadata(tmp_path):
    path = tmp_path / "file.geo"
    path.write_text(
        textwrap.dedent(
            """
            #GEO
            #FORMAT NCOLS
            #COLUMNS
            stnid	latitude	longitude	level	date	time	elevation	value_0
            # Missing values represented by 3e+38 (not user-changeable)
            #DATA
            21921	70.68	127.4	0	20190101	0	33	0.9
            6370	51.45	5.38	0	20190101	0	22	0.3
            """
        ).strip()
    )

    with pytest.raises(ValueError):
        geopoints_loader.read_units(path)


def test_geopoints_units_missing_units(tmp_path):
    path = tmp_path / "file.geo"
    path.write_text(
        textwrap.dedent(
            """
            #GEO
            #FORMAT NCOLS
            #COLUMNS
            stnid	latitude	longitude	level	date	time	elevation	value_0
            # Missing values represented by 3e+38 (not user-changeable)
            #METADATA
            date=20190101
            k=43200
            step=0
            time=0000
            #DATA
            21921	70.68	127.4	0	20190101	0	33	0.9
            6370	51.45	5.38	0	20190101	0	22	0.3
            """
        ).strip()
    )

    with pytest.raises(ValueError):
        geopoints_loader.read_units(path)


def test_geopoints_units_bad_comments_order(tmp_path):
    path = tmp_path / "file.geo"
    path.write_text(
        textwrap.dedent(
            """
            #GEO
            #FORMAT NCOLS
            #COLUMNS
            stnid	latitude	longitude	level	date	time	elevation	value_0
            # Missing values represented by 3e+38 (not user-changeable)
            #DATA
            21921	70.68	127.4	0	20190101	0	33	0.9
            6370	51.45	5.38	0	20190101	0	22	0.3
            #METADATA
            date=20190101
            k=43200
            step=0
            time=0000
            units=mm
            """
        ).strip()
    )

    with pytest.raises(ValueError):
        geopoints_loader.read_units(path)
