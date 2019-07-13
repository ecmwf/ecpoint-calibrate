import operator

import attr

from .utils import (
    compute_accumulated_field,
    compute_ratio_field,
    compute_rms_field,
    compute_vector,
    compute_weighted_average_field,
)


@attr.s(slots=True)
class Computation(object):
    meta = {
        "ACCUMULATED_FIELD": compute_accumulated_field,
        "WEIGHTED_AVERAGE_FIELD": compute_weighted_average_field,
        "24H_SOLAR_RADIATION": compute_accumulated_field,
        "VECTOR_MODULE": compute_vector,
        "ROOT_MEAN_SQUARE": compute_rms_field,
        "RATIO_FIELD": compute_ratio_field,
    }

    computation = attr.ib()

    def run(self, *args):
        scaling_factor = int(self.computation["scale"]["value"])

        computed_value = self.meta[self.computation["field"]](*args)

        if scaling_factor == 1:
            return computed_value
        else:
            scaling_op = (
                operator.mul
                if self.computation["scale"]["op"] == "MULTIPLY"
                else operator.div
            )

            return scaling_op(computed_value, scaling_factor)
