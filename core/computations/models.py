import operator

import attr

from .utils import (
    compute_accumulated_field,
    compute_local_solar_time,
    compute_rms_field,
    compute_weighted_average_field,
)


@attr.s(slots=True)
class Computation(object):
    meta = {
        "ACCUMULATED_FIELD": compute_accumulated_field,
        "WEIGHTED_AVERAGE_FIELD": compute_weighted_average_field,
        "LOCAL_SOLAR_TIME": compute_local_solar_time,
        "ACCUMULATED_SOLAR_RADIATION": compute_accumulated_field,
        "VECTOR_MODULE": compute_rms_field,
    }

    computation = attr.ib()

    def run(self, steps):
        scaling_op = (
            operator.mul
            if self.computation["scale"]["op"] == "MULTIPLY"
            else operator.div
        )

        scaling_factor = int(self.computation["scale"]["value"])

        computed_value = self.meta[self.computation["field"]](*steps)

        return scaling_op(computed_value, scaling_factor)