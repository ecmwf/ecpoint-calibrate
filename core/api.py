from __future__ import print_function
import zerorpc

class Api(object):
    def calc(self, text):
        """based on the input text, return the int result"""
        try:
            return 7
        except Exception as e:
            return 0.0

def main():
    addr = 'tcp://127.0.0.1:4242'
    s = zerorpc.Server(Api())
    s.bind(addr)
    print('start running on {}'.format(addr))
    s.run()

if __name__ == '__main__':
    main()
