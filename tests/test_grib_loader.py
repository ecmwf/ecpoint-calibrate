import operator
import os

import pytest
from random import random
from numpy import ndarray

from core.loaders.GribLoader import GribLoader
from .conf import TEST_DATA_DIR


def test_values_getter():
    path = os.path.join(
        TEST_DATA_DIR, 'cape_20150601_00_03.grib'
    )

    grib = GribLoader(path=path)
    values = grib.values

    assert isinstance(values, ndarray)
    assert (values[:5] == [9.125, 7.375, 6.625, 5.5, 4.875]).all()


def test_values_setter():
    path = os.path.join(
        TEST_DATA_DIR, 'cape_20150601_00_03.grib'
    )

    grib = GribLoader(path=path)

    with pytest.raises(TypeError):
        grib.values = 'INVALID DATA'

    grib.values = grib.values * 10  # Invoke setter method of values property.
    assert grib.path.endswith('.tmp.grib')
    assert (grib.values[:5] == [91.25, 73.75, 66.25, 55.0, 48.75]).all()


@pytest.mark.parametrize('op', [
    'add',
    'sub'
])
def test_binary_operation_with_vector(op):
    op_func = getattr(operator, op)

    grib_a = GribLoader(
        path=os.path.join(TEST_DATA_DIR, 'cape_20150601_00_03.grib')
    )
    grib_a_values = grib_a.values
    assert isinstance(grib_a_values, ndarray)

    grib_b = GribLoader(
        path=os.path.join(TEST_DATA_DIR, 'cape_20150601_00_27.grib')
    )
    grib_b_values = grib_b.values
    assert isinstance(grib_b_values, ndarray)

    grib = op_func(grib_a, grib_b)

    assert isinstance(grib, GribLoader)
    assert grib.path.endswith('.tmp.grib')

    expected_value = op_func(grib_a_values, grib_b_values)
    assert (grib.values == expected_value).all()


@pytest.mark.parametrize('op', [
    'mul',
    'div',
    'pow'
])
def test_binary_operation_with_scalar(op):
    op_func = getattr(operator, op)

    grib_a = GribLoader(
        path=os.path.join(TEST_DATA_DIR, 'cape_20150601_00_03.grib')
    )
    grib_a_values = grib_a.values
    assert isinstance(grib_a_values, ndarray)

    scalar = random() * 100  # Ex: 2.05

    grib = op_func(grib_a, scalar)

    assert isinstance(grib, GribLoader)
    assert grib.path.endswith('.tmp.grib')

    expected_value = op_func(grib_a_values, scalar)
    assert (grib.values == expected_value).all()
