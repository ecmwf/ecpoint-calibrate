from __future__ import print_function

import json
import os

from flask import Flask, request, Response

from core.computations.predictor import run
from core.computations.utils import Parameters

app = Flask(__name__)


class RPC_API_SERVER(object):
    def __init__(self):
        self.status = 'OFF'

    def echo(self, text):
        """echo any text"""
        return text

    def run_computation(self, parameters):
        parameters = Parameters(**parameters)
        self.status = 'ON'
        return run(parameters)


@app.route('/computation-logs', methods=('POST',))
def stream_computation_logs():
    parameters = Parameters(**request.get_json())
    return Response(run(parameters), mimetype='text/plain')


@app.route('/predictors', methods=('POST',))
def get_predictors():
    payload = request.get_json()
    print(payload)

    path = payload['path']

    codes = [
        name
        for name in os.listdir(path)
        if os.path.isdir(os.path.join(path, name)) and not name.startswith('.')
    ]

    return Response(json.dumps(codes), mimetype='application/json')


def main():
    app.run()


if __name__ == '__main__':
    main()
