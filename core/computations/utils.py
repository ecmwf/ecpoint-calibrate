from datetime import timedelta, datetime, time

from ..loaders.GribLoader import GribLoader

import attr


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
        total_sum = weighted_sum_of_first_and_last_items + sum(items_excluding_first_and_last)
        total_weight = len(items_excluding_first_and_last) * 1 + 2 * 0.5
        return total_sum / total_weight
    else:
        return weighted_sum_of_first_and_last_items


def compute_rms_field(*args):
    return GribLoader.rms(*args)


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
