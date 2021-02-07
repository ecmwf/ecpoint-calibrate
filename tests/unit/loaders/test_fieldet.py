import operator

import numpy as np
import pandas
import pytest

from core.loaders.fieldset import Fieldset
from core.loaders.geopoints import get_geopoints_values, read_geopoints
from tests.conf import TEST_DATA_DIR


def test_dataframe():
    path = TEST_DATA_DIR / "cape_20150601_00_03.grib"

    grib = Fieldset.from_path(path=path)

    assert isinstance(grib.dataframe, pandas.DataFrame)
    assert len(grib.dataframe) == 2140702


def test_units():
    path = TEST_DATA_DIR / "cape_20150601_00_03.grib"

    grib = Fieldset.from_path(path=path)

    assert grib.units == "J kg**-1"


def test_values_getter():
    path = TEST_DATA_DIR / "cape_20150601_00_03.grib"

    grib = Fieldset.from_path(path=path)
    values = grib.values

    assert isinstance(values, np.ndarray)
    assert (values[:5] == [9.125, 7.375, 6.625, 5.5, 4.875]).all()


def test_values_setter():
    path = TEST_DATA_DIR / "cape_20150601_00_03.grib"

    grib = Fieldset.from_path(path=path)

    with pytest.raises(NotImplementedError):
        grib.values = "WHATEVER"


@pytest.mark.parametrize("op", ["add", "sub"])
def test_binary_operation_with_vector(op):
    op_func = getattr(operator, op)

    grib_a = Fieldset.from_path(path=TEST_DATA_DIR / "cape_20150601_00_03.grib")
    grib_a_values = grib_a.values
    assert isinstance(grib_a_values, np.ndarray)

    grib_b = Fieldset.from_path(path=TEST_DATA_DIR / "cape_20150601_00_27.grib")
    grib_b_values = grib_b.values
    assert isinstance(grib_b_values, np.ndarray)

    grib = op_func(grib_a, grib_b)

    assert isinstance(grib, Fieldset)

    expected_value = op_func(grib_a_values, grib_b_values)
    np.testing.assert_almost_equal(
        actual=grib.values, desired=expected_value, decimal=4
    )

    # Check if the original GRIB files are mutated.
    assert (grib_a.values == grib_a_values).all()
    assert (grib_b.values == grib_b_values).all()


@pytest.mark.parametrize("op", ["mul", "truediv", "pow"])
def test_binary_operation_with_scalar(op):
    op_func = getattr(operator, op)

    grib_a = Fieldset.from_path(path=TEST_DATA_DIR / "cape_20150601_00_03.grib")
    grib_a_values = grib_a.values
    assert isinstance(grib_a_values, np.ndarray)

    scalar = 2

    grib = op_func(grib_a, scalar)

    assert isinstance(grib, Fieldset)

    expected_value = op_func(grib_a_values, scalar)

    if op == "pow":
        # [FIXME] - highly inaccurate: 85 and 84 are considered equal
        decimal = -1
    else:
        decimal = 10

    np.testing.assert_almost_equal(
        actual=grib.values, desired=expected_value, decimal=decimal
    )

    # Check if the original GRIB file is mutated.
    assert (grib_a.values == grib_a_values).all()


def test_complex_math_operations():
    grib_a = Fieldset.from_path(path=TEST_DATA_DIR / "cape_20150601_00_03.grib")
    grib_a_values = grib_a.values
    assert isinstance(grib_a_values, np.ndarray)

    grib_b = Fieldset.from_path(path=TEST_DATA_DIR / "cape_20150601_00_27.grib")
    grib_b_values = grib_b.values
    assert isinstance(grib_b_values, np.ndarray)

    result = (grib_b - grib_a) * 1000

    assert isinstance(result, Fieldset)
    assert (result.values == (grib_b_values - grib_a_values) * 1000).all()


def test_nearest_gridpoint():
    fieldset = Fieldset.from_path(path=TEST_DATA_DIR / "cape_20150601_00_03.grib")

    geopoints_in = read_geopoints(path=TEST_DATA_DIR / "good_geo_file.geo")
    geopoints_out = fieldset.nearest_gridpoint(geopoints_in)

    assert (geopoints_in.latitudes() == geopoints_out.latitudes()).all()
    assert (geopoints_in.longitudes() == geopoints_out.longitudes()).all()
    assert (
        get_geopoints_values(geopoints_in) != get_geopoints_values(geopoints_out)
    ).all()
    assert get_geopoints_values(geopoints_out).tolist() == [304.375, 1.25]


def test_nearest_gridpoint_new_geofile_format():
    fieldset = Fieldset.from_path(path=TEST_DATA_DIR / "cape_20150601_00_03.grib")

    geopoints_in = read_geopoints(path=TEST_DATA_DIR / "new_geo_file_format.geo")
    geopoints_out = fieldset.nearest_gridpoint(geopoints_in)

    assert (geopoints_in.latitudes() == geopoints_out.latitudes()).all()
    assert (geopoints_in.longitudes() == geopoints_out.longitudes()).all()
    assert (
        get_geopoints_values(geopoints_in) != get_geopoints_values(geopoints_out)
    ).all()
    assert get_geopoints_values(geopoints_out).tolist() == [0.25, 24.25, 0, 17.5]
