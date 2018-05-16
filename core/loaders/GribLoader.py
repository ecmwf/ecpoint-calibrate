from eccodes import GribFile

from .BaseLoader import BaseLoader


class GribLoader(BaseLoader):
    def __init__(self, path):
        self.path = path

    def read(self):
        return GribFile(self.path)

    def validate(self):
        pass