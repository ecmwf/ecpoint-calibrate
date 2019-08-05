from .utils import log


class noop(log):
    raw = True


def general_parameters_logs(config, raw=False):
    if not raw:
        f = log
    else:
        f = noop
    yield f.info(f"GENERAL PARAMETERS")
    yield f.info(f"  Model Data Format        = {config.parameters.model_type.upper()}")
    yield f.info(f"  Start Calibration Period = {config.parameters.date_start}")
    yield f.info(f"  End Calibration Period   = {config.parameters.date_end}")
    yield f.info(f"  Start Base Time          = {config.parameters.start_time} UTC")
    yield f.info(f"  End Base Time            = {24 - config.parameters.interval} UTC")
    yield f.info(f"  Base Time Interval       = {config.parameters.interval}h")
    yield f.info(f"  Spin-Up Window           = {config.parameters.limit_spin_up}h")
    yield f.info(f"")


def predictand_logs(config, raw=False):
    if not raw:
        f = log
    else:
        f = noop

    yield f.info(f"PREDICTAND")
    yield f.info(f"  Path          = {config.predictand.path}")
    yield f.info(f"  Parameter     = {config.predictand.code} (in {config.predictand.units})")
    yield f.info(f"  Type          = {config.predictand.type_.title()}")
    yield f.info(f"  Accumulation  = {config.predictand.accumulation}h")
    yield f.info(f"  Minimum Value = {config.predictand.min_value} {config.predictand.units}")

    error = (
        "Forecast Error Ratio (FER)"
        if config.predictand.error == "FER"
        else "Forecast Error (FE)"
    )
    yield f.info(f'  Error         = {error}')
    yield f.info('')


def predictors_logs(config, raw=False):
    if not raw:
        f = log
    else:
        f = noop

    yield f.info(f'PREDICTORS')
    yield f.info(f'  Path = {config.predictors.path}')

    post_processed_computations = [
        computation
        for computation in config.computations
        if computation.isPostProcessed
    ]
    for computation in post_processed_computations:
        yield f.info(f'   - {computation.fullname}, {computation.shortname} [{computation.units}]')
    yield f.info('')


def observations_logs(config, raw=False):
    if not raw:
        f = log
    else:
        f = noop

    yield f.info(f'OBSERVATIONS')
    yield f.info(f'  Path  = {config.observations.path}')
    yield f.info(f'  Units = {config.observations.units}')
    yield f.info('')


def output_file_logs(config, raw=False):
    if not raw:
        f = log
    else:
        f = noop

    yield f.info(f'OUTPUT FILE')
    yield f.info(f'  Path = {config.parameters.out_path}')
    yield f.info('')
