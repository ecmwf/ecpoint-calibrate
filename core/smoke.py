import os
import sys


def runtime_smoke_tests():
    if sys.version_info.major == 3:
        raise RuntimeError(
            'Python 3 is not supported.'
        )

    try:
        import eccodes  # noqa: F401
    except ImportError:
        raise RuntimeError(
            'eccodes package is not installed.'
        )
