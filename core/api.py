from __future__ import print_function

import zerorpc

from core.solvers.predictor import run
from core.solvers.utils import Parameters


class RPC_API_SERVER(object):
    def __init__(self):
        self.status = 'OFF'

    def echo(self, text):
        """echo any text"""
        return text

    def run_computation(self, parameters):
        parameters = Parameters(**parameters)
        self.status = 'ON'
        run(parameters)
        self.status = 'OFF'


def main():
    addr = 'tcp://127.0.0.1:4242'
    s = zerorpc.Server(RPC_API_SERVER())
    s.bind(addr)
    print('Start running on {}'.format(addr))
    s.run()


if __name__ == '__main__':
    main()
