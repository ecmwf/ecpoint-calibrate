from datetime import datetime, time, timedelta


def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days) + 1):
        yield start_date + timedelta(n)


def iter_daterange(start, end, start_time=0, discretization=6, leadstart_increment=1):
    for curr_date in daterange(start, end):
        for curr_time in range(start_time, 24, discretization):
            for leadstart in range(0, 24, leadstart_increment):
                yield curr_date, curr_time, leadstart


def adjust_leadstart(date, hour, leadstart, limSU, discretization=6):
    leadstart_difference = discretization
    timestamp = datetime.combine(date, time(hour=hour))

    if 0 <= leadstart <= limSU:
        timestamp -= timedelta(hours=leadstart_difference)
        return timestamp.date(), timestamp.time().hour, leadstart + leadstart_difference

    for each in range(0, 24, leadstart_difference):
        if each + limSU < leadstart <= each + limSU + leadstart_difference:
            timestamp += timedelta(hours=each)
            return timestamp.date(), timestamp.time().hour, leadstart - each


def generate_steps(accumulation):
    return tuple(list(range(0, accumulation, 6)) + [accumulation])


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
