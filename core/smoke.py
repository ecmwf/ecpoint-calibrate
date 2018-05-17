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


def compile_time_smoke_tests():
    class CompileTimeError(Exception):
        pass

    if sys.version_info.major == 3:
        raise CompileTimeError(
            'Python 3 is not supported.'
        )

    if 'VIRTUAL_ENV' not in os.environ:
        raise CompileTimeError(
            'You need to activate a Python 2 virtualenv.'
        )

    try:
        import Cython  # noqa: F401
    except ImportError:
        raise CompileTimeError(
            'Cython package is not installed.'
        )

    try:
        import pygame  # noqa: F401
    except ImportError:
        raise CompileTimeError(
            'pygame package is not installed.'
        )
