from datetime import date
from functools import partial

from core.processor.utils import adjust_steps, generate_steps, iter_daterange


def test_generate_leadstart():
    cases = list(
        iter_daterange(start=date(2018, 7, 1), end=date(2018, 7, 3), interval=4)
    )

    # 3 days, 6 runs per day (4-hourly), 24 step increments
    assert len(cases) == 3 * 6 * 24

    dates = set(i for i, _, _, _ in cases)
    assert dates == {date(2018, 7, 1), date(2018, 7, 2), date(2018, 7, 3)}

    times = set(i for _, i, _, _ in cases)
    assert times == {0, 4, 8, 12, 16, 20}

    steps = set(i for _, _, i, _ in cases)
    assert steps == set(range(0, 24))


def test_adjust_steps_2_model_runs_per_day():
    func = partial(adjust_steps, limSU=2, interval=12, start_hour=0)
    ###########################################################################
    # CASE 1: StepS <= LimSU                                                  #
    ###########################################################################
    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=0, step=0)
    assert new_date == date(2018, 6, 1)
    assert new_hour == 12
    assert new_step == 0 + 12

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=12, step=0)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 0
    assert new_step == 12

    ###########################################################################
    # CASE 2: LimSU < StepS <= LimSU + 12                                     #
    ###########################################################################

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=0, step=3)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 0
    assert new_step == 3

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=12, step=3)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 12
    assert new_step == 3

    ###########################################################################
    # CASE 3: StepS >= LimSU + 12                                             #
    ###########################################################################
    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=0, step=17)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 12
    assert new_step == 5

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=12, step=17)
    assert new_date == date(2018, 6, 3)
    assert new_hour == 0
    assert new_step == 5


def test_adjust_steps_4_model_runs_per_day():
    func = partial(adjust_steps, limSU=2, interval=6, start_hour=0)
    ###########################################################################
    # CASE 1: StepS <= LimSU                                                  #
    ###########################################################################
    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=0, step=0)
    assert new_date == date(2018, 6, 1)
    assert new_hour == 18
    assert new_step == 6

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=6, step=0)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 0
    assert new_step == 6

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=12, step=0)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 6
    assert new_step == 6

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=18, step=0)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 12
    assert new_step == 6

    ###########################################################################
    # CASE 2: LimSU < StepS <= LimSU + 6                                      #
    ###########################################################################
    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=0, step=4)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 0
    assert new_step == 4

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=6, step=4)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 6
    assert new_step == 4

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=12, step=4)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 12
    assert new_step == 4

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=18, step=4)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 18
    assert new_step == 4

    ###########################################################################
    # CASE 3: LimSU + 6 < StepS <= LimSU + 12                                 #
    ###########################################################################
    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=0, step=11)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 6
    assert new_step == 5

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=6, step=11)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 12
    assert new_step == 5

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=12, step=11)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 18
    assert new_step == 5

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=18, step=11)
    assert new_date == date(2018, 6, 3)
    assert new_hour == 0
    assert new_step == 5

    ###########################################################################
    # CASE 4: LimSU + 12 < StepS <= LimSU + 18                                #
    ###########################################################################

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=0, step=17)

    assert new_date == date(2018, 6, 2)
    assert new_hour == 12
    assert new_step == 5

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=6, step=17)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 18
    assert new_step == 5

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=12, step=17)
    assert new_date == date(2018, 6, 3)
    assert new_hour == 0
    assert new_step == 5

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=18, step=17)
    assert new_date == date(2018, 6, 3)
    assert new_hour == 6
    assert new_step == 5

    ###########################################################################
    # CASE 5: LimSU + 18 < StepS <= LimSU + 24                                #
    ###########################################################################
    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=0, step=21)
    assert new_date == date(2018, 6, 2)
    assert new_hour == 18
    assert new_step == 3

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=6, step=21)
    assert new_date == date(2018, 6, 3)
    assert new_hour == 0
    assert new_step == 3

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=12, step=21)
    assert new_date == date(2018, 6, 3)
    assert new_hour == 6
    assert new_step == 3

    new_date, new_hour, new_step, _ = func(date=date(2018, 6, 2), hour=18, step=21)
    assert new_date == date(2018, 6, 3)
    assert new_hour == 12
    assert new_step == 3


def test_generate_steps():
    assert generate_steps(accumulation=6, sampling_interval=6) == (0, 6)
    assert generate_steps(accumulation=12, sampling_interval=6) == (0, 6, 12)
    assert generate_steps(accumulation=24, sampling_interval=6) == (0, 6, 12, 18, 24)
