from math import asin, cos, sqrt

import attr


@attr.s
class Point(object):
    lat = attr.ib()
    lon = attr.ib()

    def distance_from(self, point):
        """
        Computes the distance from a given point using the Haversine formula.

        :type point: Point

        References:
          - https://en.wikipedia.org/wiki/Haversine_formula
          - https://stackoverflow.com/a/41337005/1946230
        """

        p = 0.017453292519943295
        a = (
            0.5
            - cos((point.lat - self.lat) * p) / 2
            + cos(self.lat * p)
            * cos(point.lat * p)
            * (1 - cos((point.lon - self.lon) * p))
            / 2
        )
        return 12742 * asin(sqrt(a))
