from pathlib import Path

import metview
import numpy


def read(path: Path) -> metview.bindings.Geopoints:
    if not path.exists():
        raise IOError(f"File does not exist: {path}")

    return metview.read(str(path))


def get_values(geopoints: metview.bindings.Geopoints) -> numpy.ndarray:
    if "value_0" in geopoints.columns():
        return geopoints["value_0"]

    return geopoints.values()
