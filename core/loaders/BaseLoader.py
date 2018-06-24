from abc import ABCMeta, abstractmethod


class BaseLoader(object):
    __metaclass__ = ABCMeta

    path = None


class BasePredictorLoader(object):
    __metaclass__ = ABCMeta

    path = None

    @abstractmethod
    def __add__(self, other):
        pass

    @abstractmethod
    def __sub__(self, other):
        pass

    @abstractmethod
    def __mul__(self, other):
        pass

    @abstractmethod
    def __div__(self, other):
        pass

    @abstractmethod
    def rms(cls):
        pass
