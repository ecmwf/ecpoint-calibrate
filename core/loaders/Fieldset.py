import logging
import os
import tempfile
from contextlib import contextmanager
from functools import partial

import attr
import metview as mv
import numpy as np
import pandas

from .BaseLoader import BasePredictorLoader
from .generics import Point
from .utils import poolcontext

logger = logging.getLogger(__name__)


class Fieldset(mv.Fieldset):
    @property
    def dataframe(self):
        data_variables = list(self.to_dataset().data_vars)
        return self.to_dataset().to_dataframe()[
            ["latitude", "longitude"] + data_variables
        ]

    def nearest_gridpoint__naive(self, geopoints):
        """
        Instance method to take a list of observation geopoints and match the
        forecast in the GRIB data for the nearest grid-point.

        Returns a Geopoints instance with the same length of `geopoints` but
        containing the forecast values.

        :param geopoints: (Geopoints | List[Geopoint] | GeopointsLoader) An
            iterable sequence of the observations.

        :return: Geopoints instance containing list of geopoint values from
            the forecast data.
        :rtype: Geopoints
        """
        df = self.dataframe.to_records(index=False)
        result = []

        for _, row in geopoints.dataframe.iterrows():
            point = Point(lat=row["lat"], lon=row["lon"])
            nearest = min(
                df, key=lambda p: point.distance_from(Point(lat=p[0], lon=p[1]))
            )
            result.append((point.lat, point.lon, nearest[2]))

        return pandas.DataFrame.from_records(result, columns=["lat", "lon", "value"])

    def nearest_gridpoint__eccodes(self, geopoints):
        with load_grib(self.path) as gid:
            result = map(
                partial(nearest_value_func, gid),
                geopoints.dataframe[["lat", "lon"]].to_records(index=False),
            )

        return pandas.DataFrame.from_records(result, columns=["lat", "lon", "value"])

    nearest_gridpoint = nearest_gridpoint__eccodes

    @property
    def values(self):
        """
        Property to access the values key of the GRIB file as a numpy
        array.

        :rtype: numpy.ndarray
        """

        return mv.values(self)

    @values.setter
    def values(self, values):
        raise NotImplementedError

    @classmethod
    def rms(cls, *args):
        """
        classmethod to compute the root mean square value of sequence of
        Fieldset instances.

        :param args: (Tuple[Fieldset]) Sequence of Fieldset instances.
        :return: New `Fieldset` instance containing the root mean square
            value.
        :rtype: Fieldset
        """
        if len(args) == 0:
            raise Exception

        term_1 = args[0]

        sum_squared_values = sum(abs(term.values) ** 2 for term in args)
        mean_squared_values = sum_squared_values / 2.0

        values = np.sqrt(mean_squared_values)
        return term_1.clone_with_new_values(values)

    def __add__(self, other):
        mv_fieldset = super().__add__(other)
        mv_fieldset.__class__ = type(self)
        return mv_fieldset

    def __sub__(self, other):
        mv_fieldset = super().__sub__(other)
        mv_fieldset.__class__ = type(self)
        return mv_fieldset

    def __mul__(self, other):
        mv_fieldset = super().__mul__(other)
        mv_fieldset.__class__ = type(self)
        return mv_fieldset

    def __truediv__(self, other):
        mv_fieldset = super().__truediv__(other)
        mv_fieldset.__class__ = type(self)
        return mv_fieldset

    def __pow__(self, other):
        """
        The native implementation of __pow__ is inaccurate and lossy.
        """

        # ds = self.to_dataset()
        # updated_ds = ds ** other
        # for var in ds.data_vars:
        #     updated_ds[var].attrs = ds[var].attrs.copy()

        # mv_fieldset = mv.dataset_to_fieldset(
        #     updated_ds
        # )

        mv_fieldset = super().__pow__(other)
        mv_fieldset.__class__ = type(self)
        return mv_fieldset
