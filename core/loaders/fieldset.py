import logging
import os
from functools import reduce
from pathlib import Path
from typing import Union

import metview
import numpy as np

logger = logging.getLogger(__name__)


class Fieldset(metview.Fieldset):
    def __init__(self, path):
        raise PermissionError("Initilizing this class directly is not allowed.")

    @property
    def units(self):
        return metview.grib_get_string(self, "units")

    @property
    def name(self) -> str:
        return metview.grib_get_string(self, "name")

    @classmethod
    def from_path(cls, path: Union[Path, str]):
        if isinstance(path, Path):
            path = str(path)

        if not os.path.exists(path):
            raise IOError(f"File does not exist: {path}")

        obj = metview.read(path)
        obj.__class__ = cls
        return obj

    @property
    def dataframe(self):
        data_variables = list(self.to_dataset().data_vars)
        return self.to_dataset().to_dataframe()[
            ["latitude", "longitude"] + data_variables
        ]

    def nearest_gridpoint(self, geopoints):
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
        return metview.nearest_gridpoint(self, geopoints)

    @property
    def values(self):
        """
        Property to access the values key of the GRIB file as a numpy
        array.

        :rtype: numpy.ndarray
        """

        return metview.values(self)

    @values.setter
    def values(self, values):
        raise NotImplementedError

    @classmethod
    def vector_of(cls, *args):
        """
        classmethod to compute the vector of sequence of Fieldset instances.

        :param args: (Tuple[Fieldset]) Sequence of Fieldset instances.
        :return: New `Fieldset` instance containing the vector value
        :rtype: Fieldset
        """
        if len(args) == 0:
            raise Exception

        term_1 = args[0]

        sum_squared_values = sum(abs(term.values) ** 2 for term in args)
        values = np.sqrt(sum_squared_values)

        mv_fieldset = metview.set_values(term_1, values)
        mv_fieldset.__class__ = cls

        return mv_fieldset

    @classmethod
    def max_of(cls, *args):
        if len(args) == 0:
            raise Exception

        term_1 = args[0]

        values = reduce(np.maximum, (arg.values for arg in args))

        mv_fieldset = metview.set_values(term_1, values)
        mv_fieldset.__class__ = cls

        return mv_fieldset

    @classmethod
    def min_of(cls, *args):
        if len(args) == 0:
            raise Exception

        term_1 = args[0]

        values = reduce(np.minimum, (arg.values for arg in args))

        mv_fieldset = metview.set_values(term_1, values)
        mv_fieldset.__class__ = cls

        return mv_fieldset

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
        # var = ds.data_vars[0]
        #
        # updated_values_data_array = updated_ds[var]
        # updated_values_numpy = updated_values_data_array.to_series().to_numpy()
        #
        # mv_fieldset = metview.set_values(updated_values_numpy)

        mv_fieldset = super().__pow__(other)
        mv_fieldset.__class__ = type(self)
        return mv_fieldset


class NetCDF:
    def __init__(self, dataframe):
        self.dataframe = dataframe

    @classmethod
    def from_path(cls, path: Union[Path, str]):
        if isinstance(path, Path):
            path = str(path)

        mv_instance = metview.read(path)

        dataset = mv_instance.to_dataset()
        data_vars = list(dataset.data_vars)
        coords = list(
            {"lat", "lon", "latitude", "longitude", "latitudes", "longitudes"}
            & set(dataset.coords)
        )

        df = dataset.to_dataframe().reset_index()

        df = df[coords + data_vars]

        for coord in coords:
            df[coord] = df[coord].apply(str)

        return cls(df)

    def __mul__(self, other):
        s = self.dataframe.select_dtypes(include=[np.number]) * other
        df = self.dataframe.copy()
        df[s.columns] = s

        return type(self)(df)

    def __add__(self, other):
        s = self.dataframe.select_dtypes(include=[np.number]) + other
        df = self.dataframe.copy()
        df[s.columns] = s

        return type(self)(df)

    def __sub__(self, other):
        s = self.dataframe.select_dtypes(include=[np.number]) - other
        df = self.dataframe.copy()
        df[s.columns] = s

        return type(self)(df)

    def __truediv__(self, other):
        s = self.dataframe.select_dtypes(include=[np.number]) / other
        df = self.dataframe.copy()
        df[s.columns] = s

        return type(self)(df)

    def __pow__(self, power, modulo=None):
        s = self.dataframe.select_dtypes(include=[np.number]) ** power
        df = self.dataframe.copy()
        df[s.columns] = s

        return type(self)(df)
