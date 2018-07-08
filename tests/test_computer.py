from datetime import date

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
    ###########################################################################
    # CASE 1: LeadStart <= LimSU                                              #
    ###########################################################################
    new_date, new_hour, new_leadstart = adjust_leadstart(
        date=date(2018, 06, 02),
        hour=0,
        leadstart=0,
        limSU=2,
        model_runs_per_day=2
    )
    assert new_date == date(2018, 06, 01)
    assert new_hour == 12
    assert new_leadstart == 0 + 12

    new_date, new_hour, new_leadstart = adjust_leadstart(
        date=date(2018, 06, 02),
        hour=12,
        leadstart=0,
        limSU=2,
        model_runs_per_day=2
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 0
    assert new_leadstart == 12

    ###########################################################################
    # CASE 2: LimSU < LeadStart <= LimSU + 12                                 #
    ###########################################################################

    new_date, new_hour, new_leadstart = adjust_leadstart(
        date=date(2018, 06, 02),
        hour=0,
        leadstart=3,
        limSU=2,
        model_runs_per_day=2
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 0
    assert new_leadstart == 3

    new_date, new_hour, new_leadstart = adjust_leadstart(
        date=date(2018, 06, 02),
        hour=12,
        leadstart=3,
        limSU=2,
        model_runs_per_day=2
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 12
    assert new_leadstart == 3

    ###########################################################################
    # CASE 3: LeadStart >= LimSU + 12                                         #
    ###########################################################################
    new_date, new_hour, new_leadstart = adjust_leadstart(
        date=date(2018, 06, 02),
        hour=0,
        leadstart=17,
        limSU=2,
        model_runs_per_day=2
    )
    assert new_date == date(2018, 06, 02)
    assert new_hour == 12
    assert new_leadstart == 5

    new_date, new_hour, new_leadstart = adjust_leadstart(
        date=date(2018, 06, 02),
        hour=12,
        leadstart=17,
        limSU=2,
        model_runs_per_day=2
    )
    assert new_date == date(2018, 06, 03)
    assert new_hour == 0
    assert new_leadstart == 5


