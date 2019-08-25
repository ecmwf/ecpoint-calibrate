from datetime import datetime, time, timedelta


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)


def iter_daterange(
    start_date, end_date, start_hour, model_interval, step_interval, spinup_limit
):
    case = 1
    for curr_date in daterange(start_date, end_date):
        for curr_time in range(start_hour, 24, model_interval):
            for step_s in range(
                spinup_limit, model_interval + spinup_limit, step_interval
            ):
                yield curr_date, curr_time, step_s, case
                case += 1
