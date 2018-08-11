from datetime import timedelta, datetime, time


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)


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
    return tuple(range(0, accumulation, 6) + [accumulation])


class log(object):
    @classmethod
    def info(cls, message):
        return "[INFO] " + message + "[END]"

    @classmethod
    def warn(cls, message):
        return "[WARNING] " + message + "[END]"

    @classmethod
    def error(cls, message):
        return "[ERROR] " + message + "[END]"

    @classmethod
    def success(cls, message):
        return "[SUCCESS] " + message + "[END]"
