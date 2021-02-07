from typing import Literal

import pytest

from core.api import app
from core.loaders import load_point_data_by_path
from tests.conf import TEST_DATA_DIR


@pytest.fixture
def client():
    app.config["TESTING"] = True

    with app.test_client() as client:
        with app.app_context():
            yield client


@pytest.fixture
def alfa_cassette():
    def f(output_path: str, fmt: Literal["ASCII", "PARQUET"]):
        forecasts_path = TEST_DATA_DIR / "ecmwf" / "forecasts"
        observations_path = TEST_DATA_DIR / "ecmwf" / "observations"
        predictand_path = forecasts_path / "tp"

        return {
            "parameters": {
                "date_start": "2015-05-31T22:00:00.000Z",
                "date_end": "2015-06-01T22:00:00.000Z",
                "spinup_limit": "3",
                "out_path": output_path,
                "out_format": fmt,
                "model_type": "grib",
                "model_interval": "12",
                "step_interval": "12",
                "start_time": "0",
            },
            "predictand": {
                "path": str(predictand_path),
                "accumulation": "12",
                "code": "tp",
                "error": "FER",
                "min_value": "0.001",
                "type_": "ACCUMULATED",
                "units": "m",
            },
            "predictors": {
                "path": str(forecasts_path),
                "codes": ["v700", "tp", "sr", "u700", "cape", "cp"],
                "sampling_interval": "6",
            },
            "observations": {"path": str(observations_path), "units": "mm"},
            "computations": [
                {
                    "index": 0,
                    "shortname": "TP",
                    "fullname": "Total Precipitation",
                    "field": "ACCUMULATED_FIELD",
                    "inputs": [
                        {
                            "code": "tp",
                            "path": str(predictand_path),
                            "units": "m",
                            "name": "Total precipitation",
                        }
                    ],
                    "addScale": "0",
                    "mulScale": "1000",
                    "isPostProcessed": True,
                    "units": "mm",
                },
                {
                    "index": 1,
                    "shortname": "CP",
                    "fullname": "Convective Precipitation",
                    "field": "ACCUMULATED_FIELD",
                    "inputs": [
                        {
                            "code": "cp",
                            "name": "Convective precipitation",
                            "units": "m",
                            "path": str(forecasts_path / "cp"),
                        }
                    ],
                    "addScale": "0",
                    "mulScale": "1000",
                    "isPostProcessed": True,
                    "units": "mm",
                },
                {
                    "index": 2,
                    "shortname": "CPR",
                    "fullname": "Convective Precipitation Ratio",
                    "field": "RATIO_FIELD",
                    "inputs": [
                        {
                            "code": "CP",
                            "name": "Convective Precipitation",
                            "units": "mm",
                            "path": str(forecasts_path / "CP"),
                        },
                        {
                            "code": "TP",
                            "name": "Total Precipitation",
                            "units": "mm",
                            "path": str(forecasts_path / "TP"),
                        },
                    ],
                    "addScale": "0",
                    "mulScale": "1",
                    "isPostProcessed": True,
                    "units": "NoUnit",
                },
                {
                    "index": 3,
                    "shortname": "CAPE",
                    "fullname": "Convective Available Potential Energy",
                    "field": "WEIGHTED_AVERAGE_FIELD",
                    "inputs": [
                        {
                            "code": "cape",
                            "name": "Convective available potential energy",
                            "units": "J kg**-1",
                            "path": str(forecasts_path / "cape"),
                        }
                    ],
                    "addScale": "0",
                    "mulScale": "1",
                    "isPostProcessed": True,
                    "units": "J kg**-1",
                },
                {
                    "index": 4,
                    "shortname": "U700",
                    "fullname": "U700",
                    "field": "AVERAGE_FIELD",
                    "inputs": [
                        {
                            "code": "u700",
                            "name": "U component of wind",
                            "units": "m s**-1",
                            "path": str(forecasts_path / "u700"),
                        }
                    ],
                    "addScale": "0",
                    "mulScale": "1",
                    "isPostProcessed": False,
                    "units": "m s**-1",
                },
                {
                    "index": 5,
                    "shortname": "V700",
                    "fullname": "V700",
                    "field": "AVERAGE_FIELD",
                    "inputs": [
                        {
                            "code": "v700",
                            "name": "V component of wind",
                            "units": "m s**-1",
                            "path": str(forecasts_path / "v700"),
                        }
                    ],
                    "addScale": "0",
                    "mulScale": "1",
                    "isPostProcessed": False,
                    "units": "m s**-1",
                },
                {
                    "index": 6,
                    "shortname": "WSPD",
                    "fullname": "Wind Speed",
                    "field": "VECTOR_MODULE",
                    "inputs": [
                        {
                            "code": "U700",
                            "name": "U700",
                            "units": "m s**-1",
                            "path": str(forecasts_path / "U700"),
                        },
                        {
                            "code": "V700",
                            "name": "V700",
                            "units": "m s**-1",
                            "path": str(forecasts_path / "V700"),
                        },
                    ],
                    "addScale": "0",
                    "mulScale": "1",
                    "isPostProcessed": True,
                    "units": "m s**-1",
                },
                {
                    "index": 7,
                    "shortname": "SR24H",
                    "fullname": "Solar Radiation",
                    "field": "24H_SOLAR_RADIATION",
                    "inputs": [
                        {
                            "code": "sr",
                            "name": "Clear-sky direct solar radiation at surface",
                            "units": "J m**-2",
                            "path": str(forecasts_path / "sr"),
                        }
                    ],
                    "addScale": "0",
                    "mulScale": "1",
                    "isPostProcessed": True,
                    "units": "W m**-2",
                },
                {
                    "index": 8,
                    "shortname": "LST",
                    "fullname": "Local Solar Time",
                    "field": "LOCAL_SOLAR_TIME",
                    "inputs": [],
                    "addScale": "0",
                    "mulScale": "1",
                    "isPostProcessed": True,
                    "units": "Hours (0 to 24)",
                },
            ],
        }

    return f


@pytest.fixture
def alfa_loader():
    def f(fmt=Literal["ASCII", "PARQUET"]):
        return load_point_data_by_path(path=str(TEST_DATA_DIR / "ecmwf" / "alfa.ascii"))

    return f
