from abc import ABCMeta, abstractproperty


class BaseLoader(object):
    __metaclass__ = ABCMeta

    path = None

    @abstractproperty
    def values(self):
        pass

    @values.setter
    def values(self, values):
        pass
