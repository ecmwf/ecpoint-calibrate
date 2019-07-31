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
    timestamp = datetime.combine(date, time(hour=hour))

    if 0 <= step <= limSU:
        timestamp -= timedelta(hours=interval)
        return timestamp.date(), timestamp.time().hour, step + interval, []

    for each in range(start_hour, 24, interval):
        if each + limSU < step <= each + limSU + interval:
            timestamp += timedelta(hours=each)
            return timestamp.date(), timestamp.time().hour, step - each, []


def __adjust_steps(date, hour, step, start_hour, limSU, interval):
    msgs = []
    end_time = list(range(start_hour, 24, interval))[-1]

    # Checks for the forecasts
    if step <= limSU:  # The forecast is within the spin-up window
        msgs.append("Forecast within the spin-up window. Let's consider instead...")
        new_hour = hour - interval
        new_step = step + interval
        if new_hour < 0:
            new_date = date - timedelta(1)
            new_hour = end_time
        else:
            new_date = date
    else:  # The forecast is not within the spin-up window
        if step >= interval:  # There is a shorter range forecast available
            msgs.append("A shorter range forecast can be considered...")
            new_hour_tmp = hour + interval
            new_step_tmp = step - interval
            if new_hour_tmp > end_time:
                new_date_tmp = date + timedelta(1)
                new_hour_tmp = start_hour
            else:
                new_date_tmp = date

            if (
                new_step_tmp <= limSU
            ):  # The shorter range forecast is within the spin-up window
                new_date = date
                new_hour = hour
                new_step = step
                msgs.append(
                    "Forecast within the spin-up window. Let's consider the previous forecast instead..."
                )
            else:
                new_date = new_date_tmp
                new_hour = new_hour_tmp
                new_step = new_step_tmp
        else:
            new_date = date
            new_hour = hour
            new_step = step

    return new_date, new_hour, new_step, msgs


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
