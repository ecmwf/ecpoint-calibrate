import os
from textwrap import dedent


def general_parameters_logs(config):
    return dedent(
        f"""
        GENERAL PARAMETERS
          Model Data Format                       = {config.parameters.model_type.upper()}
          Start Calibration Period                = {config.parameters.date_start}
          End Calibration Period                  = {config.parameters.date_end}
          First Model Run (in the day)            = {config.parameters.start_time} UTC
          Last Model Run (in the day)             = {24 - config.parameters.model_interval} UTC
          Interval between Model Runs             = {config.parameters.model_interval} h
          Interval between Forecast Validity Time = {config.parameters.step_interval} h
          Forecast Data Sampling Interval         = {config.predictors.sampling_interval} h
          Spin-Up Window                          = {config.parameters.spinup_limit} h
    """
    )


def predictand_logs(config):
    error = (
        "Forecast Error Ratio (FER) [-]"
        if config.predictand.error == "FER"
        else f"Forecast Error (FE) [{config.observations.units}]"
    )

    return dedent(
        f"""
        PREDICTAND
          Variable                  = {config.predictand.code} (in {config.predictand.units})
          Type                      = {config.predictand.type_.title()}   
          Accumulation              = {config.predictand.accumulation} h
          Minimum Value             = {config.predictand.min_value} {config.predictand.units}
          Scaling Factor (Multiply) = {config.computations[0].mulScale}
          Scaling Factor (Add)      = {config.computations[0].addScale}
          Forecast Database         = {config.predictand.path}
          Forecase Error            = {error}
    """
    )


def predictors_logs(config):
    post_processed_computations = [
        computation
        for computation in config.computations
        if computation.isPostProcessed
    ]

    base = dedent(
        f"""
    PREDICTORS
      Forecast Database = {config.predictors.path}
      List of Predictors:
    """
    )

    for computation in post_processed_computations:
        base += f"      - {computation.fullname}, {computation.shortname} [{computation.units}]\n"

    return base


def observations_logs(config):
    return dedent(
        f"""
    OBSERVATIONS
      Parameter             = {os.path.basename(config.predictand.path)} (in {config.observations.units})
      Observations Database = {config.observations.path}
    """
    )


def output_file_logs(config):
    return dedent(
        f"""
    OUTPUT FILE
      Path = {config.parameters.out_path}
    """
    )


def point_data_table_logs():
    return dedent(
        f"""
    ************************************
    ecPoint-Calibrate - POINT DATA TABLE
    ************************************
    NOTE: 'DateOBS' and 'TimeOBS' correspond to the end of the accumulation period
          (as defined by 'BaseDate', 'BaseTime', and 'StepF').

          'BaseDate' and 'DateOBS' are given in the YYYYMMDD format.
          'BaseTime' and 'TimeOBS' are given in UTC time.
          'StepF' is given in the HH format.
          'LatOBS' is given in degrees North (i.e. from -90 to +90 N).
          'LonOBS' is given in degrees East (i.e. from -180 to +180 E).
    """
    )
