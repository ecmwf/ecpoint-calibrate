import operator
from datetime import timedelta, datetime, time
from functools import reduce

import attr

from ..loaders.GribLoader import GribLoader


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)


@attr.s
class Parameters(object):
    # start base date of the forecast (in YYYYMMDD format)
    date_start = attr.ib(converter=str)

    # final base date of the forecast (in YYYYMMDD format)
    date_end = attr.ib(converter=str)

    # accumulation (in hours) of the parameter to post-process
    accumulation = attr.ib(converter=int)

    # upper limit (in hours) of the window in forecast with spin-up problems
    limit_spin_up = attr.ib(converter=int)

    # range for the leadtime (in hours)
    leadstart_range = attr.ib(converter=int)

    # path of the database that contains the observations for the parameter
    # to post-process
    observation_path = attr.ib(converter=str)

    # path of the database that contains the parameter to post-process and the
    # predictors
    forecast_path = attr.ib(converter=str)

    # output file path
    out_path = attr.ib(converter=str)

    computation_fields = attr.ib(default=attr.Factory(list))

    computation_errors = attr.ib(default=attr.Factory(dict))

    predictor_codes = attr.ib(default=attr.Factory(list))


def iter_daterange(start, end, model_runs_per_day=2, leadstart_increment=1):
    for curr_date in daterange(start, end):
        for curr_time in range(0, 24, 24 // model_runs_per_day):
            for leadstart in range(0, 24, leadstart_increment):
                yield curr_date, curr_time, leadstart


def adjust_leadstart(date, hour, leadstart, limSU, model_runs_per_day):
    leadstart_difference = 24 // model_runs_per_day
    timestamp = datetime.combine(date, time(hour=hour))

    if 0 <= leadstart <= limSU:
        timestamp -= timedelta(hours=leadstart_difference)
        return timestamp.date(), timestamp.time().hour, leadstart + leadstart_difference

    for each in range(0, 24, leadstart_difference):
        if each + limSU < leadstart <= each + limSU + leadstart_difference:
            timestamp += timedelta(hours=each)
            return timestamp.date(), timestamp.time().hour, leadstart - each


def generate_steps(accumulation):
    return tuple(
        range(0, accumulation, 6) + [accumulation]
    )


def compute_accumulated_field(*args):
    return args[-1] - args[0]


def compute_weighted_average_field(*args):
    weighted_sum_of_first_and_last_items = args[0] * 0.5 + args[-1] * 0.5
    items_excluding_first_and_last = args[1: len(args)-1]

    if items_excluding_first_and_last:
        total_sum = reduce(
            operator.add,
            items_excluding_first_and_last,
            weighted_sum_of_first_and_last_items
        )
        total_weight = len(items_excluding_first_and_last) * 1 + 2 * 0.5
        return total_sum / total_weight
    else:
        return weighted_sum_of_first_and_last_items


def compute_rms_field(*args):
    return GribLoader.rms(*args)


def compute_local_solar_time(longitudes, hour):
    """
    Compute the Local Solar Time
    """
    # Select values at the right of the Greenwich Meridian
    temp_lonPos = longitudes * (longitudes >= 0)
    # Compute the time difference between the local place and the Greenwich Meridian
    lstPos = hour + (temp_lonPos / 15.0)
    # Put back to zero the values that are not part of the subset (lonObs_1 >= 0)
    lstPos = lstPos * (temp_lonPos != 0)
    # Adjust the times that appear bigger than 24 (the time relates to the following day)
    temp_lstPosMore24 = (lstPos * (lstPos >= 24)) - 24
    temp_lstPosMore24 = temp_lstPosMore24 * (temp_lstPosMore24 > 0)
    # Restore the dataset
    tempPos = lstPos * (lstPos < 24) + temp_lstPosMore24
    # Select values at the left of the Greenwich Meridian
    temp_lonNeg = longitudes * (longitudes < 0)
    # Compute the time difference between the local place and the Greenwich Meridian
    lstNeg = hour - abs((temp_lonNeg / 15.0))
    # Put back to zero the values that are not part of the subset (lonObs_1 < 0)
    lstNeg = lstNeg * (temp_lonNeg != 0)
    # Adjust the times that appear smaller than 24 (the time relates to the previous day)
    temp_lstNegLess0 = lstNeg * (lstNeg < 0) + 24
    temp_lstNegLess0 = temp_lstNegLess0 * (temp_lstNegLess0 != 24)
    # Restore the dataset
    tempNeg = lstNeg * (lstNeg > 0) + temp_lstNegLess0
    # Combine both subsets
    return tempPos + tempNeg  # [XXX] Review this line


class log(object):
    @classmethod
    def info(cls, message):
        return '[INFO] ' + message + '[END]'

    @classmethod
    def warn(cls, message):
        return '[WARNING] ' + message + '[END]'

    @classmethod
    def error(cls, message):
        return '[ERROR] ' + message + '[END]'

    @classmethod
    def success(cls, message):
        return '[SUCCESS] ' + message + '[END]'
