import operator
from functools import reduce

from ..loaders.Fieldset import Fieldset


def compute_accumulated_field(*args):
    return args[-1] - args[0]


def compute_weighted_average_field(*args):
    weighted_sum_of_first_and_last_items = args[0] * 0.5 + args[-1] * 0.5
    items_excluding_first_and_last = args[1 : len(args) - 1]

    if items_excluding_first_and_last:
        total_sum = reduce(
            operator.add,
            items_excluding_first_and_last,
            weighted_sum_of_first_and_last_items,
        )
        total_weight = len(items_excluding_first_and_last) * 1 + 2 * 0.5
        return total_sum / total_weight
    else:
        return weighted_sum_of_first_and_last_items


def compute_rms_field(*args):
    return Fieldset.rms(*args)


def compute_ratio_field(dividend, divisor):
    return dividend / divisor
