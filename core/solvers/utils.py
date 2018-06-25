import attr

from datetime import timedelta


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)


@attr.s
class Parameters(object):
    # start base date of the forecast (in YYYYMMDD format)
    date_start = attr.ib()

    # final base date of the forecast (in YYYYMMDD format)
    date_end = attr.ib()

    # accumulation (in hours) of the parameter to post-process
    accumulation = attr.ib()

    # upper limit (in hours) of the window in forecast with spin-up problems
    limit_spin_up = attr.ib()

    # range for the leadtime (in hours)
    leadstart_range = attr.ib()

    # path of the database that contains the observations for the parameter
    # to post-process
    observation_path = attr.ib()

    # path of the database that contains the parameter to post-process and the
    # predictors
    forecast_path = attr.ib()

    # output file path
    out_path = attr.ib()

