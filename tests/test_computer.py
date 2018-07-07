from datetime import date

from core.solvers.utils import generate_leadstart


def test_generate_leadstart():
    cases = list(generate_leadstart(
        date_start=date(2018, 07, 01),
        date_end=date(2018, 07, 03),
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
