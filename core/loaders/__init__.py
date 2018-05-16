import importlib


def get_loader_cls(_type):
    """Get the loader class corresponding to a given type.

    This function allows us to dynamically import loader classes, without
    actually importing them during startup.

    :param _type: (str) String representing the loader type.
    :return: Loader class.
    """
    mapping = {
        'GRIB': 'GribLoader'
    }

    module = importlib.import_module(
        'core.loaders.{mod}'.format(mod=mapping[_type])
    )

    return getattr(module, mapping[_type])
