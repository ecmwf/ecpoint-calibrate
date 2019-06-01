import json
import os
import re

import pandas
from flask import Flask, Response, jsonify, request
from healthcheck import EnvironmentDump, HealthCheck

from core.loaders.ascii import ASCIIDecoder
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

    return Response(json.dumps(codes), mimetype="application/json")


@app.route("/get-fields-from-ascii-table", methods=("POST",))
def get_fields_from_ascii_table():
    payload = request.get_json()
    path = payload["path"]

    comments = ASCIIDecoder(path=path).comments
    m = re.search(r"# Post-processed computations: (.*)", comments)
    fields = m.group(1).strip().split(", ")

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
    matrix = [[str(cell) for cell in row] for row in df_out.as_matrix().tolist()]

    predictor_matrix = ASCIIDecoder(path=path).dataframe
    tree = dt.construct_tree(predictor_matrix).json

    return jsonify({"records": matrix, "labels": list(df_out.columns), "tree": [tree]})


def main():
    kwargs = {
        "host": "0.0.0.0",
        "port": "8888",
        "use_reloader": True if "DEBUG" in os.environ else False,
    }

    app.run(**kwargs)


if __name__ == "__main__":
    main()
