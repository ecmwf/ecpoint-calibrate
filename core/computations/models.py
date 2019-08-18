import operator

import attr

from .utils import (
    compute_24h_solar_radiation,
    compute_accumulated_field,
    compute_average_field,
    compute_instantaneous_field,
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
        "INSTANTANEOUS_FIELD": compute_instantaneous_field,
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
        scaling_factor = float(self.computation.scale["value"])

        computed_value = self.meta[self.computation.field](*args)

        if scaling_factor == 1:
            return computed_value
        else:
            scaling_op = (
                operator.mul
                if self.computation.scale["op"] == "MULTIPLY"
                else operator.truediv
            )

            return scaling_op(computed_value, scaling_factor)

    @classmethod
    def filter_paths_to_read(cls, paths, computation):
        if computation == "ACCUMULATED_FIELD":
            return paths[0], paths[-1]
        if computation == "INSTANTANEOUS_FIELD":
            return paths[0]
        if computation == "24H_SOLAR_RADIATION":
            return paths[0], paths[-1]

        if computation == "RATIO_FIELD":
            return paths

        if computation in (
            "WEIGHTED_AVERAGE_FIELD",
            "MAXIMUM_FIELD",
            "MINIMUM_FIELD",
            "AVERAGE_FIELD",
            "VECTOR_MODULE",
        ):
            return paths
