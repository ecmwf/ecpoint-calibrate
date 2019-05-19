import logging
from pathlib import Path
from typing import Union

import metview
import numpy as np

from .geopoints import Geopoints

logger = logging.getLogger(__name__)


class Fieldset(metview.Fieldset):
    def __init__(self, path):
        raise PermissionError("Initilizing this class directly is not allowed.")

    @classmethod
    def from_native(cls, path: Union[Path, str]):
        if isinstance(path, Path):
            path = str(path)

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
        geopoints_out = metview.nearest_gridpoint(self, geopoints)
        geopoints_out.__class__ = Geopoints
        return geopoints_out.dataframe

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

        # mv_fieldset = metview.dataset_to_fieldset(
        #     updated_ds
        # )

        mv_fieldset = super().__pow__(other)
        mv_fieldset.__class__ = type(self)
        return mv_fieldset
