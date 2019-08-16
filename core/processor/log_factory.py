from textwrap import dedent


def general_parameters_logs(config):
    return dedent(
        f"""
        GENERAL PARAMETERS
          Model Data Format        = {config.parameters.model_type.upper()}
          Start Calibration Period = {config.parameters.date_start}
          End Calibration Period   = {config.parameters.date_end}
          Start Base Time          = {config.parameters.start_time} UTC
          End Base Time            = {24 - config.parameters.interval} UTC
          Base Time Interval       = {config.parameters.interval}h
          Spin-Up Window           = {config.parameters.limit_spin_up}h
    """
    )


def predictand_logs(config):
    error = (
        "Forecast Error Ratio (FER)"
        if config.predictand.error == "FER"
        else "Forecast Error (FE)"
    )

    return dedent(
        f"""
        PREDICTAND
          Path          = {config.predictand.path}
          Parameter     = {config.predictand.code} (in {config.predictand.units})
          Type          = {config.predictand.type_.title()}
          Accumulation  = {config.predictand.accumulation}h
          Minimum Value = {config.predictand.min_value} {config.predictand.units}
          Error         = {error}
    """
    )


def predictors_logs(config):
    post_processed_computations = [
        computation
        for computation in config.computations
        if computation.isPostProcessed
    ]

    base = f"""
    PREDICTORS
      Path = {config.predictors.path}
    """

    for computation in post_processed_computations:
        base += f"     - {computation.fullname}, {computation.shortname} [{computation.units}]\n"

    return dedent(base)


def observations_logs(config):
    return dedent(
        f"""
    OBSERVATIONS
      Path  = {config.observations.path}
      Units = {config.observations.units}
    """
    )


def output_file_logs(config):
    return dedent(
        f"""
    OUTPUT FILE
      Path = {config.parameters.out_path}
    """
    )
