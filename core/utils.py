import os
from datetime import date
from typing import Union, Sequence

import dateutil.parser
from numpy import inf


def tolist(gen):
    """Convert a generator into a function which returns a list"""

    def patched(*args, **kwargs):
        return list(gen(*args, **kwargs))

    return patched


def int_or_float(value: float) -> Union[int, float]:
    if value in [inf, -inf]:
        return value
    return value if value != int(value) else int(value)


def sanitize_path(path: str) -> str:
    if bindings := os.environ.get("HOST_BINDINGS"):
        bindings = bindings.split(",")
    else:
        return path

    for binding in bindings:
        host, local = binding.split(":")
        path = path.replace(host, local)

    return path


def format_date(value: str) -> date:
    return dateutil.parser.isoparse(value).date()


def wrap_title(title: Sequence, chunk_size: int):
    """
    Chunk titles in groups of, and join them by new-line character.
    """
    chunks = [title[i:i + chunk_size] for i in range(0, len(title), chunk_size)]
    return "\n".join(" ".join(chunk) for chunk in chunks)
