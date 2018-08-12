from __future__ import print_function

import json
import os

import pandas
from flask import Flask, Response, request, jsonify

from core.postprocessors.decision_tree import DecisionTree
from core.processor import run
from core.processor.models import Parameters

app = Flask(__name__)


@app.route("/computation-logs", methods=("POST",))
def stream_computation_logs():
    parameters = Parameters(**request.get_json())
    return Response(run(parameters), mimetype="text/plain")


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


@app.route("/postprocessing/create-naive-decision-tree", methods=("POST",))
def get_naive_decision_tree():
    payload = request.get_json()
    labels, records = payload["labels"], payload["records"]

    df = pandas.DataFrame.from_records(records, columns=labels)
    thrL, thrH = df.iloc[:, ::2], df.iloc[:, 1::2]
    dt = DecisionTree(thrL_in=thrL, thrH_in=thrH)
    dt.create()

    df_out = dt.thrL_out.join(dt.thrH_out)

    matrix = [[str(cell) for cell in row] for row in df_out.as_matrix().tolist()]

    return jsonify({"records": matrix, "labels": list(df_out.columns)})


def main():
    app.run(host="0.0.0.0", port="8888")


if __name__ == "__main__":
    main()
