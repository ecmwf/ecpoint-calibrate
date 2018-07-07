import attr

from datetime import timedelta


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


def generate_leadstart(BaseDateS, BaseDateF, model_runs_per_day=2, leadstart_increments=1):
    for curr_date in daterange(BaseDateS, BaseDateF):
        for curr_time in range(0, 24, 24 // model_runs_per_day):
            for leadstart in range(0, 24, leadstart_increments):
                yield curr_date, curr_time, leadstart