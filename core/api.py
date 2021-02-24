import json
import os
import traceback
from datetime import datetime
from functools import lru_cache
from io import StringIO
from pathlib import Path
from textwrap import dedent

import pandas
from flask import Flask, Response, jsonify, request
from flask_cors import CORS
from healthcheck import EnvironmentDump, HealthCheck

from core.loaders import geopoints as geopoints_loader
from core.loaders import load_point_data_by_path
from core.loaders.fieldset import Fieldset
from core.models import Config
from core.postprocessors.decision_tree import DecisionTree, WeatherType
from core.postprocessors.ks_engine import KolmogorovSmirnovEngine
from core.processor import run
from core.svc import postprocessing as postprocessing_svc
from core.utils import sanitize_path

app = Flask(__name__)
CORS(app)

# wrap the flask app and give a heathcheck url
health = HealthCheck(app, "/healthcheck")
envdump = EnvironmentDump(app, "/environment")


@app.errorhandler(Exception)
def handle_error(e):
    code = getattr(e, "code", 500)

    tb = traceback.format_exception_only(type(e), e) or [str(e)]
    return "\n".join(tb), code


@app.route("/computation-logs", methods=("POST",))
def stream_computation_logs():
    payload = request.get_json()
    config = Config.from_dict(payload)
    run(config)
    return Response()


@app.route("/predictors", methods=("POST",))
def get_predictors():
    payload = request.get_json()
    path = sanitize_path(payload["path"])

    codes = [
        name
        for name in os.listdir(path)
        if os.path.isdir(os.path.join(path, name)) and not name.startswith(".")
    ]

    # Warming up the LRU cache for fetching units
    for code in codes:
        get_metadata(os.path.join(path, code))

    return Response(json.dumps(codes), mimetype="application/json")


@app.route("/loaders/observations/metadata", methods=("POST",))
def get_obs_metadata():
    payload = request.get_json()
    path = Path(sanitize_path(payload["path"]))

    first_geo_file = next(path.glob("**/*.geo"))

    try:
        units = geopoints_loader.read_units(first_geo_file)
    except ValueError:
        units = None

    return Response(json.dumps({"units": units}), mimetype="application/json")


@app.route("/postprocessing/pdt-tools/statistics", methods=("POST",))
def get_pdt_statistics():
    payload = request.get_json()
    path = sanitize_path(payload["path"])

    resp = postprocessing_svc.get_pdt_statistics(path)
    return Response(json.dumps(resp), mimetype="application/json")


@app.route("/get-pdt-metadata", methods=("POST",))
def get_pdt_metadata():
    payload = request.get_json()
    path = sanitize_path(payload["path"])

    loader = load_point_data_by_path(path)

    return Response(json.dumps(loader.metadata), mimetype="application/json")


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
    labels, thrWT, path, y_lim, bins, cheaper = (
        payload["labels"],
        payload["thrWT"],
        sanitize_path(payload["path"]),
        payload["yLim"],
        payload["bins"],
        payload["cheaper"],
    )

    loader = load_point_data_by_path(path, cheaper=cheaper)

    thrWT = [float(cell) for cell in thrWT]
    series = pandas.Series(dict(zip(labels, thrWT)))
    thrL, thrH = series.iloc[::2], series.iloc[1::2]

    bins = [float(each) for each in bins]

    wt = WeatherType(
        thrL=thrL, thrH=thrH, thrL_labels=labels[::2], thrH_labels=labels[1::2]
    )

    df, title = wt.evaluate(loader.error_type.name, loader=loader)
    error = df[loader.error_type.name]

    plot = wt.plot(error, bins, title, int(y_lim))

    return jsonify({"histogram": plot})


@app.route("/postprocessing/save-wt-histograms", methods=("POST",))
def save_wt_histograms():
    payload = request.get_json()
    labels, thrGridOut, path, y_lim, destination, bins, cheaper = (
        payload["labels"],
        payload["thrGridOut"],
        sanitize_path(payload["path"]),
        payload["yLim"],
        payload["destinationDir"],
        payload["bins"],
        payload["cheaper"],
    )
    destination = sanitize_path(destination)

    loader = load_point_data_by_path(path, cheaper=cheaper)

    matrix = [[float(cell) for cell in row[1:]] for row in thrGridOut]
    df = pandas.DataFrame.from_records(matrix, columns=labels)

    bins = [float(each) for each in bins]

    thrL_out, thrH_out = df.iloc[:, ::2], df.iloc[:, 1::2]

    for idx in range(len(thrL_out)):
        thrL = thrL_out.iloc[idx]
        thrH = thrH_out.iloc[idx]
        wt = WeatherType(
            thrL=thrL, thrH=thrH, thrL_labels=labels[::2], thrH_labels=labels[1::2]
        )

        dataframe, title = wt.evaluate(loader.error_type.name, loader=loader)
        error = dataframe[loader.error_type.name]

        wt_code = thrGridOut[idx][0]
        wt.plot(
            error,
            bins,
            title,
            y_lim=int(y_lim),
            out_path=os.path.join(destination, f"WT_{wt_code}.png"),
        )

    return jsonify({"status": "success"})


@app.route("/postprocessing/create-error-rep", methods=("POST",))
def get_error_rep():
    payload = request.get_json()
    labels, matrix, path, numCols, cheaper = (
        payload["labels"],
        payload["matrix"],
        sanitize_path(payload["path"]),
        payload["numCols"],
        payload["cheaper"],
    )

    matrix = [[float(cell) for cell in row] for row in matrix]
    df = pandas.DataFrame.from_records(matrix, columns=labels)
    thrL, thrH = df.iloc[:, ::2], df.iloc[:, 1::2]
    loader = load_point_data_by_path(path, cheaper=cheaper)
    rep = DecisionTree.cal_rep_error(
        loader, thrL_out=thrL, thrH_out=thrH, nBin=int(numCols)
    )

    s = StringIO()
    rep.to_csv(s)
    return jsonify(s.getvalue())


@app.route("/postprocessing/save", methods=("POST",))
def save_operation():
    payload = request.get_json()

    labels = payload["labels"]
    matrix = payload["matrix"]
    pdt_path = sanitize_path(payload["pdtPath"])
    mf_cols = payload["mfcols"]
    cheaper = payload["cheaper"]
    mode = payload["mode"]
    output_path = Path(sanitize_path(payload["outPath"]))

    if mode == "all":
        version = payload["version"]
        output_path = output_path / f"OperCalOuts_{version}"
        os.makedirs(output_path, exist_ok=True)

    if mode in ["breakpoints", "all"]:
        csv = payload["breakpointsCSV"]
        path = output_path
        if mode == "all":
            path = path / "BreakPointsWT.csv"

        with open(path, "w") as f:
            f.write(csv)

    if mode in ["mf", "all"]:
        matrix = [[float(cell) for cell in row] for row in matrix]
        df = pandas.DataFrame.from_records(matrix, columns=labels)
        thrL, thrH = df.iloc[:, ::2], df.iloc[:, 1::2]
        loader = load_point_data_by_path(pdt_path, cheaper=cheaper)
        rep = DecisionTree.cal_rep_error(
            loader, thrL_out=thrL, thrH_out=thrH, nBin=int(mf_cols)
        )

        path = output_path
        if mode == "all":
            path = path / f"{loader.error_type.name}.csv"

        with open(path, "w") as f:
            rep.to_csv(f)

    if mode in ["wt", "all"]:
        ylim = payload["yLim"]
        bins = payload["bins"]
        thrGridOut = payload["thrGridOut"]

        matrix = [[float(cell) for cell in row[1:]] for row in thrGridOut]
        df = pandas.DataFrame.from_records(matrix, columns=labels)

        loader = load_point_data_by_path(pdt_path, cheaper=cheaper)
        bins = [float(each) for each in bins]

        thrL_out, thrH_out = df.iloc[:, ::2], df.iloc[:, 1::2]

        path = output_path
        if mode == "all":
            path = path / "WTs"

            os.makedirs(path, exist_ok=True)

        for idx in range(len(thrL_out)):
            thrL = thrL_out.iloc[idx]
            thrH = thrH_out.iloc[idx]
            wt = WeatherType(
                thrL=thrL, thrH=thrH, thrL_labels=labels[::2], thrH_labels=labels[1::2]
            )

            dataframe, title = wt.evaluate(loader.error_type.name, loader=loader)
            error = dataframe[loader.error_type.name]

            wt_code = thrGridOut[idx][0]
            wt.plot(
                error,
                bins,
                title,
                y_lim=int(ylim),
                out_path=os.path.join(path, f"WT_{wt_code}.png"),
            )

    if mode in ["bias", "all"]:
        thrGridOut = payload["thrGridOut"]

        matrix = [[float(cell) for cell in row[1:]] for row in thrGridOut]
        df = pandas.DataFrame.from_records(matrix, columns=labels)

        loader = load_point_data_by_path(pdt_path, cheaper=cheaper)

        thrL_out, thrH_out = df.iloc[:, ::2], df.iloc[:, 1::2]

        path = output_path
        if mode == "all":
            path = path / "BiasesWT.csv"

        csv = []
        for idx in range(len(thrL_out)):
            thrL = thrL_out.iloc[idx]
            thrH = thrH_out.iloc[idx]
            wt = WeatherType(
                thrL=thrL, thrH=thrH, thrL_labels=labels[::2], thrH_labels=labels[1::2]
            )

            dataframe, title = wt.evaluate(loader.error_type.name, loader=loader)
            error = dataframe[loader.error_type.name]
            bias = f"{1 + error.mean():.2f}"
            wt_code = thrGridOut[idx][0]
            csv += [(wt_code, bias)]

        pandas.DataFrame.from_records(csv, columns=["WT Code", "Bias"]).to_csv(
            path, index=False
        )

    if mode == "all":
        family = payload["family"]
        version = payload["version"]

        accumulation = payload["accumulation"]
        accumulation = f", {accumulation}-hourly" if accumulation else ""

        with open(output_path / "README.txt", "w") as f:
            text = dedent(
                f"""
                ecPoint-{family}{accumulation}
                Version: {version}
                Timestamp: {datetime.now()}
                """
            )

            f.write(text.lstrip())

    return Response(json.dumps({}), mimetype="application/json")


@app.route("/get-predictor-metadata", methods=("POST",))
def get_predictor_units():
    payload = request.get_json()
    path = sanitize_path(payload["path"])

    metadata = get_metadata(path)
    return Response(json.dumps(metadata), mimetype="application/json")


@app.route("/postprocessing/get-breakpoints-suggestions", methods=("POST",))
def get_breakpoints_suggestions():
    payload = request.get_json()

    labels, thrWT, path, predictor, minNumCases, numSubSamples, cheaper = (
        payload["labels"],
        payload["thrWT"],
        sanitize_path(payload["path"]),
        payload["predictor"],
        int(payload["minNumCases"]),
        int(payload["numSubSamples"]),
        payload["cheaper"],
    )

    loader = load_point_data_by_path(path, cheaper=cheaper)

    thrWT = [float(cell) for cell in thrWT]
    series = pandas.Series(dict(zip(labels, thrWT)))
    thrL, thrH = series.iloc[::2], series.iloc[1::2]

    wt = WeatherType(
        thrL=thrL, thrH=thrH, thrL_labels=labels[::2], thrH_labels=labels[1::2]
    )

    df, title = wt.evaluate(loader.error_type.name, predictor, loader=loader)
    error = df[loader.error_type.name].to_numpy()
    predictor = df[predictor]

    sort_indices = predictor.argsort()
    error = error[sort_indices]
    predictor = predictor[::]
    predictor.sort_values(inplace=True)

    PosAll = pandas.Series(range(len(predictor)))
    PosBP = pandas.Series(
        list(range(0, len(predictor), len(predictor) // numSubSamples))
        + [len(predictor)]
    )
    breakpoints = KolmogorovSmirnovEngine().run(predictor, error, PosAll, PosBP)

    return Response(
        json.dumps({"breakpoints": breakpoints}), mimetype="application/json"
    )


@app.route("/postprocessing/plot-cv-map", methods=("POST",))
def get_obs_frequency():
    payload = request.get_json()
    labels, thrWT, path, code, mode, cheaper = (
        payload["labels"],
        payload["thrWT"],
        sanitize_path(payload["path"]),
        payload["code"],
        payload["mode"],
        payload["cheaper"],
    )

    loader = load_point_data_by_path(path, cheaper=cheaper)

    thrWT = [float(cell) for cell in thrWT]
    series = pandas.Series(dict(zip(labels, thrWT)))
    thrL, thrH = series.iloc[::2], series.iloc[1::2]

    wt = WeatherType(
        thrL=thrL, thrH=thrH, thrL_labels=labels[::2], thrH_labels=labels[1::2]
    )

    df, _ = wt.evaluate(
        loader.error_type.name, "LonOBS", "LatOBS", "OBS", loader=loader
    )
    cv_map = wt.plot_maps(df, code, mode.lower())

    return jsonify(cv_map)


@lru_cache(maxsize=None)
def get_metadata(path):
    base_predictor_path = Path(path)

    if not base_predictor_path.exists():
        return "-"

    first_grib_file = next(base_predictor_path.glob("**/*.grib"))

    fieldset = Fieldset.from_path(first_grib_file)
    return {"units": fieldset.units, "name": fieldset.name}


def main():
    kwargs = {
        "host": "0.0.0.0",
        "port": "8888",
        "use_reloader": True if "DEBUG" in os.environ else False,
    }

    app.run(**kwargs)


if __name__ == "__main__":
    main()
