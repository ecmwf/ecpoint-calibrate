import numpy

from core.loaders.ascii import ASCIIDecoder
from tests.conf import TEST_DATA_DIR


def test_good_ascii_file():
    path = TEST_DATA_DIR / "good_ascii_file.ascii"

    data = ASCIIDecoder(path=path)

    assert numpy.allclose(
        data.dataframe["WSPD"], [6.163900, 4.319410, 6.537020, 8.513560, 8.770020]
    )


def test_alfa_units():
    path = TEST_DATA_DIR / "ecmwf" / "alfa.ascii"
    data = ASCIIDecoder(path=path)

    assert data.units == {
        "predictand": {"tp": "m"},
        "predictors": {
            "TP": "mm",
            "CP": "mm",
            "CPR": "-",
            "CAPE": "J kg**-1",
            "WSPD": "m s**-1",
            "SR24H": "W m**-2",
            "LST": "Hours (0 to 24)",
        },
        "observations": {"tp": "mm"},
    }
