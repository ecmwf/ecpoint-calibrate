from __future__ import print_function

import json
import os

from flask import Flask, request, Response

from core.processor import run
from core.processor.utils import Parameters

app = Flask(__name__)


@app.route('/computation-logs', methods=('POST',))
def stream_computation_logs():
    parameters = Parameters(**request.get_json())
    return Response(run(parameters), mimetype='text/plain')


@app.route('/predictors', methods=('POST',))
def get_predictors():
    payload = request.get_json()
    path = payload['path']

    codes = [
        name
        for name in os.listdir(path)
        if os.path.isdir(os.path.join(path, name)) and not name.startswith('.')
    ]

    return Response(json.dumps(codes), mimetype='application/json')


def main():
    app.run(host='0.0.0.0', port='8888')


if __name__ == '__main__':
    main()
