from datetime import date
from functools import partial

from core.solvers.utils import iter_daterange, adjust_leadstart


def test_generate_leadstart():
    cases = list(iter_daterange(
        start=date(2018, 07, 01),
        end=date(2018, 07, 03),
        model_runs_per_day=4,
        leadstart_increment=2
    ))

    # 3 days, 4 runs per day, 12 increments
    assert len(cases) == 3 * 4 * 12

    dates = set(i for i, _, _ in cases)
    assert dates == {date(2018, 07, 01), date(2018, 07, 02),
                     date(2018, 07, 03)}

    times = set(i for _, i, _ in cases)
    assert times == {0, 6, 12, 18}

    leadstarts = set(i for _, _, i in cases)
    assert leadstarts == set(range(0, 24, 2))


def test_adjust_leadstart_2_model_runs_per_day():
    func = partial(adjust_leadstart, limSU=2, model_runs_per_day=2)
    ###########################################################################
    # CASE 1: LeadStart <= LimSU                                              #
    ###########################################################################
    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=0, leadstart=0
    )
    assert new_date == date(2018, 06, 01)
    assert new_hour == 12
    assert new_leadstart == 0 + 12

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=12, leadstart=0
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 0
    assert new_leadstart == 12

    ###########################################################################
    # CASE 2: LimSU < LeadStart <= LimSU + 12                                 #
    ###########################################################################

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=0, leadstart=3
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 0
    assert new_leadstart == 3

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=12, leadstart=3
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 12
    assert new_leadstart == 3

    ###########################################################################
    # CASE 3: LeadStart >= LimSU + 12                                         #
    ###########################################################################
    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=0, leadstart=17
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 12
    assert new_leadstart == 5

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=12, leadstart=17
    )
    assert new_date == date(2018, 06, 03)
    assert new_hour == 0
    assert new_leadstart == 5


def test_adjust_leadstart_4_model_runs_per_day():
    func = partial(adjust_leadstart, limSU=2, model_runs_per_day=4)
    ###########################################################################
    # CASE 1: LeadStart <= LimSU                                              #
    ###########################################################################
    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=0, leadstart=0
    )
    assert new_date == date(2018, 06, 01)
    assert new_hour == 18
    assert new_leadstart == 6

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=6, leadstart=0
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 0
    assert new_leadstart == 6

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=12, leadstart=0
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 6
    assert new_leadstart == 6

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=18, leadstart=0
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 12
    assert new_leadstart == 6

    ###########################################################################
    # CASE 2: LimSU < LeadStart <= LimSU + 6                                  #
    ###########################################################################
    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=0, leadstart=4
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 0
    assert new_leadstart == 4

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=6, leadstart=4
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 6
    assert new_leadstart == 4

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=12, leadstart=4
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 12
    assert new_leadstart == 4

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=18, leadstart=4
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 18
    assert new_leadstart == 4

    ###########################################################################
    # CASE 3: LimSU + 6 < LeadStart <= LimSU + 12                             #
    ###########################################################################
    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=0, leadstart=11
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 6
    assert new_leadstart == 5

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=6, leadstart=11
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 12
    assert new_leadstart == 5

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=12, leadstart=11
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 18
    assert new_leadstart == 5

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=18, leadstart=11
    )
    assert new_date == date(2018, 06, 03)
    assert new_hour == 0
    assert new_leadstart == 5

    ###########################################################################
    # CASE 4: LimSU + 12 < LeadStart <= LimSU + 18                            #
    ###########################################################################
    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=0, leadstart=17
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 12
    assert new_leadstart == 5

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=6, leadstart=17
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 18
    assert new_leadstart == 5

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=12, leadstart=17
    )
    assert new_date == date(2018, 06, 03)
    assert new_hour == 0
    assert new_leadstart == 5

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=18, leadstart=17
    )
    assert new_date == date(2018, 06, 03)
    assert new_hour == 6
    assert new_leadstart == 5

    ###########################################################################
    # CASE 4: LimSU + 18 < LeadStart <= LimSU + 24                            #
    ###########################################################################
    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=0, leadstart=21
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 18
    assert new_leadstart == 3

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=6, leadstart=21
    )
    assert new_date == date(2018, 06, 03)
    assert new_hour == 0
    assert new_leadstart == 3

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=12, leadstart=21
    )
    assert new_date == date(2018, 06, 03)
    assert new_hour == 6
    assert new_leadstart == 3

    new_date, new_hour, new_leadstart = func(
        date=date(2018, 06, 02), hour=18, leadstart=21
    )
    assert new_date == date(2018, 06, 03)
    assert new_hour == 12
    assert new_leadstart == 3
