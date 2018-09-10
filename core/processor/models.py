import attr


@attr.s
class Parameters(object):
    # start base date of the forecast (in YYYYMMDD format)
    date_start = attr.ib(converter=str)

    # final base date of the forecast (in YYYYMMDD format)
    date_end = attr.ib(converter=str)

    # accumulation (in hours) of the parameter to post-process
    accumulation = attr.ib(converter=int)

    # upper limit (in hours) of the window in forecast with spin-up problems
    limit_spin_up = attr.ib(converter=int)

    # range for the leadtime (in hours)
    leadstart_range = attr.ib(converter=int)

    # path of the database that contains the observations for the parameter
    # to post-process
    observation_path = attr.ib(converter=str)

    # path of the database that contains the parameter to post-process and the
    # predictors
    forecast_path = attr.ib(converter=str)

    # output file path
    out_path = attr.ib(converter=str)

    predictand_code = attr.ib(converter=str)

    predictand_type = attr.ib(converter=str)

    predictand_error = attr.ib(converter=str)

    predictand_min_value = attr.ib(converter=str)

    computation_fields = attr.ib(default=attr.Factory(list))

    predictor_codes = attr.ib(default=attr.Factory(list))
