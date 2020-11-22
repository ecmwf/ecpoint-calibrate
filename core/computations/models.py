import operator

import attr

from .utils import (
    compute_24h_solar_radiation,
    compute_accumulated_field,
    compute_average_field,
    compute_instantaneous_field_100,
    compute_instantaneous_field_010,
    compute_instantaneous_field_001,
    compute_local_solar_time,
    compute_maximum,
    compute_minimum,
    compute_ratio_field,
    compute_vector,
    compute_weighted_average_field,
)


@attr.s(slots=True)
class Computer(object):
    meta = {
        "ACCUMULATED_FIELD": compute_accumulated_field,
        "INSTANTANEOUS_FIELD_100": compute_instantaneous_field_100,
        "INSTANTANEOUS_FIELD_010": compute_instantaneous_field_010,
        "INSTANTANEOUS_FIELD_001": compute_instantaneous_field_001,
        "WEIGHTED_AVERAGE_FIELD": compute_weighted_average_field,
        "24H_SOLAR_RADIATION": compute_24h_solar_radiation,
        "VECTOR_MODULE": compute_vector,
        "RATIO_FIELD": compute_ratio_field,
        "MAXIMUM_FIELD": compute_maximum,
        "MINIMUM_FIELD": compute_minimum,
        "AVERAGE_FIELD": compute_average_field,
        "LOCAL_SOLAR_TIME": compute_local_solar_time,
    }

    computation = attr.ib()

    def run(self, *args):
        computed_value = self.meta[self.computation.field](*args)

        if self.computation.mulScale == 1 and self.computation.addScale == 0:
            return computed_value
        else:
            return operator.mul(
                operator.add(computed_value, self.computation.addScale),
                self.computation.mulScale,
            )
