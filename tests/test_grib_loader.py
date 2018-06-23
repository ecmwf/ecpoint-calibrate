import os

import pytest
from numpy import ndarray

from core.loaders.GribLoader import GribLoader
from .conf import TEST_DATA_DIR


def test_grib_values_getter():
    path = os.path.join(
        TEST_DATA_DIR, 'cape_20150601_00_03.grib'
    )

    grib = GribLoader(path=path)
    values = grib.values

    assert isinstance(values, ndarray)
    assert (values[:5] == [9.125, 7.375, 6.625, 5.5, 4.875]).all()


def test_grib_values_setter():
    path = os.path.join(
        TEST_DATA_DIR, 'cape_20150601_00_03.grib'
    )

    grib = GribLoader(path=path)

    with pytest.raises(TypeError):
        grib.values = 'INVALID DATA'

    grib.values = grib.values * 10  # Invoke setter method of values property.
    assert grib.path.endswith('.tmp.grib')
    assert (grib.values[:5] == [91.25, 73.75, 66.25, 55.0, 48.75]).all()
