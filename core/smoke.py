import sys


def run_smoke_tests():
    if sys.version_info.major == 3:
        raise RuntimeError(
            'Smoke test failed: Python 3 is not supported.'
        )

    try:
        import eccodes  # noqa: F401
    except ImportError:
        raise RuntimeError(
            'Smoke test failed: eccodes package is not installed.'
        )
