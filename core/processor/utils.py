import os
from datetime import datetime, time, timedelta


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)


def iter_daterange(start, end, interval, start_hour=0):
    case = 1
    for curr_date in daterange(start, end):
        for curr_time in range(start_hour, 24, interval):
            for step_s in range(0, 24):
                yield curr_date, curr_time, step_s, case
                case += 1


def adjust_steps(date, hour, step, start_hour, limSU, interval):
    msgs = []
    timestamp = datetime.combine(date, time(hour=hour))

    if 0 <= step <= limSU:
        timestamp -= timedelta(hours=interval)
        msgs.append(
            "  Forecast within the spin-up window. Let's consider instead the following."
        )
        return timestamp.date(), timestamp.time().hour, step + interval, msgs

    for each in range(start_hour, 24, interval):
        if each + limSU < step <= each + limSU + interval:
            if each != 0:
                msgs.append("  A shorter range forecast can be considered.")
            timestamp += timedelta(hours=each)
            return timestamp.date(), timestamp.time().hour, step - each, msgs


def generate_steps(accumulation, sampling_interval):
    return tuple(list(range(0, accumulation, sampling_interval)) + [accumulation])
