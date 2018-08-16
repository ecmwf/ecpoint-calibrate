def tolist(gen):
    """Convert a generator into a function which returns a list"""

    def patched(*args, **kwargs):
        return list(gen(*args, **kwargs))

    return patched
