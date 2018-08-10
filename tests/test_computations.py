from core.computations.utils import (
    compute_accumulated_field,
    compute_weighted_average_field,
)


def test_compute_accumulated_field():
    assert compute_accumulated_field(1, 2, 3, 4, 5) == 4


def test_compute_weighted_average_field():
    assert compute_weighted_average_field(2, 4) == 3
    assert compute_weighted_average_field(2, 4, 6) == 4
    assert compute_weighted_average_field(2, 4, 4, 6) == 4
    assert compute_weighted_average_field(2, 4, 8, 4, 6) == 5
