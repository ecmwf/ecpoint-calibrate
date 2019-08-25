import json
import os
from functools import lru_cache
from io import StringIO
from pathlib import Path

import numpy as np
import pandas
from flask import Flask, Response, jsonify, request
from healthcheck import EnvironmentDump, HealthCheck

from core.loaders.ascii import ASCIIDecoder
from core.loaders.fieldset import Fieldset
from core.models import Config
from core.postprocessors.decision_tree import DecisionTree, WeatherType
from core.processor import run

app = Flask(__name__)

# wrap the flask app and give a heathcheck url
health = HealthCheck(app, "/healthcheck")
envdump = EnvironmentDump(app, "/environment")


@app.route("/computation-logs", methods=("POST",))
def stream_computation_logs():
    payload = request.get_json()
    config = Config.from_dict(payload)
    run(config)
    return Response()


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
    fields = set(df.columns) - {
        "latOBS",
        "lonOBS",
        "TimeUTC",
        "Date",
        "FER",
        "LST",
        "OBS",
    }
    return Response(json.dumps(list(fields)), mimetype="application/json")


@app.route("/postprocessing/create-wt-matrix", methods=("POST",))
def create_weather_types_matrix():
    payload = request.get_json()
    labels, records = payload["labels"], payload["records"]

    df = pandas.DataFrame.from_records(records, columns=labels)
    thrL, thrH = df.iloc[:, ::2], df.iloc[:, 1::2]
    dt = DecisionTree(thrL_in=thrL, thrH_in=thrH)
    thrL, thrH = dt.create()

    df_out = pandas.concat([thrL, thrH], axis=1)
    df_out = df_out[labels]

    matrix = [[str(cell) for cell in row] for row in df_out.values]

    return jsonify({"matrix": matrix})


@app.route("/postprocessing/get-wt-codes", methods=("POST",))
def get_wt_codes():
    payload = request.get_json()

    labels, records = payload["labels"], payload["matrix"]

    records = [[float(cell) for cell in row] for row in records]

    df = pandas.DataFrame.from_records(records, columns=labels)

    thrL, thrH = df.iloc[:, ::2], df.iloc[:, 1::2]

    codes = DecisionTree.wt_code(thrL, thrH)

    return jsonify({"codes": codes})


@app.route("/postprocessing/create-decision-tree", methods=("POST",))
def get_decision_tree():
    payload = request.get_json()
    labels, matrix = payload["labels"], payload["matrix"]

    matrix = [[float(cell) for cell in row] for row in matrix]

    df = pandas.DataFrame.from_records(matrix, columns=labels)

    thrL, thrH = df.iloc[:, ::2], df.iloc[:, 1::2]

    tree = DecisionTree.construct_tree(thrL_out=thrL, thrH_out=thrH)

    return jsonify([tree.json])


@app.route("/postprocessing/generate-wt-histogram", methods=("POST",))
def get_wt_histogram():
    payload = request.get_json()
    labels, thrWT, path, y_lim = (
        payload["labels"],
        payload["thrWT"],
        payload["path"],
        payload["yLim"],
    )

    predictor_matrix = ASCIIDecoder(path=path).dataframe

    thrWT = [float(cell) for cell in thrWT]
    series = pandas.Series(dict(zip(labels, thrWT)))
    thrL, thrH = series.iloc[::2], series.iloc[1::2]

    wt = WeatherType(
        thrL=thrL, thrH=thrH, thrL_labels=labels[::2], thrH_labels=labels[1::2]
    )
    error, title = wt.evaluate(predictor_matrix)
    plot = wt.plot(error, title, float(y_lim))

    return jsonify({"histogram": plot})


@app.route("/postprocessing/save-wt-histograms", methods=("POST",))
def save_wt_histograms():
    payload = request.get_json()
    labels, thrGridOut, path, y_lim, destination = (
        payload["labels"],
        payload["thrGridOut"],
        payload["path"],
        payload["yLim"],
        payload["destinationDir"],
    )

    predictor_matrix = ASCIIDecoder(path=path).dataframe

    matrix = [[float(cell) for cell in row[1:]] for row in thrGridOut]
    df = pandas.DataFrame.from_records(matrix, columns=labels)

    thrL_out, thrH_out = df.iloc[:, ::2], df.iloc[:, 1::2]

    for idx in range(len(thrL_out)):
        thrL = thrL_out.iloc[idx]
        thrH = thrH_out.iloc[idx]
        wt = WeatherType(
            thrL=thrL, thrH=thrH, thrL_labels=labels[::2], thrH_labels=labels[1::2]
        )

        error, title = wt.evaluate(predictor_matrix)

        wt_code = thrGridOut[idx][0]
        wt.plot(
            error,
            title,
            y_lim=float(y_lim),
            out_path=os.path.join(destination, f"WT_{wt_code}"),
        )

    return jsonify({"status": "success"})


@app.route("/postprocessing/create-error-rep", methods=("POST",))
def get_error_rep():
    payload = request.get_json()
    labels, matrix, path = payload["labels"], payload["matrix"], payload["path"]

    matrix = [[float(cell) for cell in row] for row in matrix]

    df = pandas.DataFrame.from_records(matrix, columns=labels)

    thrL, thrH = df.iloc[:, ::2], df.iloc[:, 1::2]

    predictor_matrix = ASCIIDecoder(path=path).dataframe
    rep = DecisionTree.cal_rep_error(
        predictor_matrix, thrL_out=thrL, thrH_out=thrH, nBin=100
    )

    s = StringIO()
    np.savetxt(s, rep, delimiter=",")

    return jsonify(s.getvalue())


@app.route("/get-predictor-units", methods=("POST",))
def get_predictor_units():
    payload = request.get_json()
    path = payload["path"]

    units = get_units(path)

    return Response(json.dumps({"units": units}), mimetype="application/json")


@app.route("/postprocessing/get-breakpoints-suggestions", methods=("POST",))
def get_breakpoints_suggestions():
    payload = request.get_json()

    labels, thrWT, path, predictor = (
        payload["labels"],
        payload["thrWT"],
        payload["path"],
        payload["predictor"],
    )

    predictor_matrix = ASCIIDecoder(path=path).dataframe

    thrWT = [float(cell) for cell in thrWT]
    series = pandas.Series(dict(zip(labels, thrWT)))
    thrL, thrH = series.iloc[::2], series.iloc[1::2]

    wt = WeatherType(
        thrL=thrL, thrH=thrH, thrL_labels=labels[::2], thrH_labels=labels[1::2]
    )
    error, title = wt.evaluate(predictor_matrix)

    # predictor = predictor_matrix[predictor]
    # error = error[predictor.argsort()]

    return Response(
        json.dumps({"error": error, "title": title}), mimetype="application/json"
    )


@app.route("/postprocessing/validate-num-sub-samples", methods=("POST",))
def get_sample_size():
    payload = request.get_json()

    path, predictor, numSubMem, minNumCases, numSubSamples = (
        payload["path"],
        payload["predictor"],
        int(payload["numSubMem"]),
        int(payload["minNumCases"]),
        int(payload["numSubSamples"]),
    )

    predictor_matrix = ASCIIDecoder(path=path).dataframe
    predictor = predictor_matrix[predictor]

    if (len(predictor) // numSubSamples) < (minNumCases * numSubMem) < len(predictor):
        return Response(
            json.dumps(
                {
                    "type": "negative",
                    "header": "The size of the sub-samples to analyse is too small",
                    "body": [
                        f"Minimum no. of cases in each sub-sample: {minNumCases * numSubMem}",
                        f"Size of the sub-samples analysed: {len(predictor) // numSubSamples}",
                        "Please provide a smaller number of sub-samples.",
                    ],
                }
            ),
            mimetype="application/json",
        )

    return Response(
        json.dumps(
            {
                "type": "positive",
                "header": "Validation of the sub-sample size is successful",
                "body": [
                    f"No. of considered sub-samples: {numSubSamples}",
                    f"No. of cases in each sub-sample: {len(predictor) // numSubSamples}",
                    f"Minimum no. of cases in each sub-sample: {minNumCases * numSubMem}",
                ],
            }
        ),
        mimetype="application/json",
    )


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
