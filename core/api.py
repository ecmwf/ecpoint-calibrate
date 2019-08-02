import json
import os
from functools import lru_cache
from pathlib import Path

import pandas
from flask import Flask, Response, jsonify, request
from healthcheck import EnvironmentDump, HealthCheck

from core.loaders.ascii import ASCIIDecoder
from core.loaders.fieldset import Fieldset
from core.models import Config
from core.postprocessors.decision_tree import DecisionTree
from core.processor import run

app = Flask(__name__)

# wrap the flask app and give a heathcheck url
health = HealthCheck(app, "/healthcheck")
envdump = EnvironmentDump(app, "/environment")


@app.route("/computation-logs", methods=("POST",))
def stream_computation_logs():
    payload = request.get_json()

    config = Config.from_dict(payload)

    return Response(run(config), mimetype="text/plain")


@app.route("/predictors", methods=("POST",))
def get_predictors():
    payload = request.get_json()
    path = payload["path"]

    codes = [
        name
        for name in os.listdir(path)
        if os.path.isdir(os.path.join(path, name)) and not name.startswith(".")
    ]

    # Warming up the LRU cache for fetching units
    for code in codes:
        get_units(os.path.join(path, code))

    return Response(json.dumps(codes), mimetype="application/json")


@app.route("/get-fields-from-ascii-table", methods=("POST",))
def get_fields_from_ascii_table():
    payload = request.get_json()
    path = payload["path"]

    df = ASCIIDecoder(path=path).dataframe
    fields = set(df.columns) - {"latOBS", "lonOBS", "TimeUTC", "Date", "FER", "LST"}
    return Response(json.dumps(fields), mimetype="application/json")


@app.route("/postprocessing/create-naive-decision-tree", methods=("POST",))
def get_naive_decision_tree():
    payload = request.get_json()
    labels, records, path = (payload["labels"], payload["records"], payload["path"])

    df = pandas.DataFrame.from_records(records, columns=labels)
    thrL, thrH = df.iloc[:, ::2], df.iloc[:, 1::2]
    dt = DecisionTree(thrL_in=thrL, thrH_in=thrH)
    dt.create()

    df_out = dt.thrL_out.join(dt.thrH_out)
    matrix = [[str(cell) for cell in row] for row in df_out.values]

    predictor_matrix = ASCIIDecoder(path=path).dataframe
    tree = dt.construct_tree(predictor_matrix).json

    return jsonify({"records": matrix, "labels": list(df_out.columns), "tree": [tree]})


@app.route("/get-predictor-units", methods=("POST",))
def get_predictor_units():
    payload = request.get_json()
    path = payload["path"]

    units = get_units(path)

    return Response(json.dumps({"units": units}), mimetype="application/json")


@lru_cache(maxsize=None)
def get_units(path):
    base_predictor_path = Path(path)

    if not base_predictor_path.exists():
        return "-"

    first_grib_file = next(base_predictor_path.glob("**/*.grib"))
    return Fieldset.from_path(first_grib_file).units


def main():
    kwargs = {
        "host": "0.0.0.0",
        "port": "8888",
        "use_reloader": True if "DEBUG" in os.environ else False,
    }

    app.run(**kwargs)


if __name__ == "__main__":
    main()
