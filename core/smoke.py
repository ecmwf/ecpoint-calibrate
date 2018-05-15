import sys


def runtime_smoke_tests():
    if sys.version_info.major == 2:
        raise RuntimeError(
            'Python 2 is not supported.'
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
