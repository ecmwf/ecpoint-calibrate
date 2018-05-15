from abc import ABCMeta, abstractmethod


class BaseLoader(object):
    __metaclass__ = ABCMeta

    path = None

    @abstractmethod
    def read(self):
        pass