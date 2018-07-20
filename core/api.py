from __future__ import print_function

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


def main():
    app.run()


if __name__ == '__main__':
    main()
