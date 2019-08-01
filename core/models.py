import attr


@attr.s
class Parameters(object):
    # start base date of the forecast (in YYYYMMDD format)
    date_start = attr.ib(converter=str)

    # final base date of the forecast (in YYYYMMDD format)
    date_end = attr.ib(converter=str)

    # upper limit (in hours) of the window in forecast with spin-up problems
    limit_spin_up = attr.ib(converter=int)

    # output file path
    out_path = attr.ib(converter=str)

    # Model type: {grib, netcdf}
    model_type = attr.ib(converter=str)


@attr.s
class Predictand(object):
    # accumulation (in hours) of the parameter to post-process
    accumulation = attr.ib(converter=int)

    path = attr.ib(converter=str)

    code = attr.ib(converter=str)

    error = attr.ib(converter=str)

    min_value = attr.ib(converter=str)


@attr.s
class Observations(object):
    # path of the database that contains the observations for the parameter
    # to post-process
    path = attr.ib(converter=str)

    # discretization (in hours)
    discretization = attr.ib(converter=int)

    # observation start time
    start_time = attr.ib(converter=int)


@attr.s
class Predictors(object):
    # path of the database that contains the parameter to post-process and the
    # predictors
    path = attr.ib(converter=str)

    codes = attr.ib(default=attr.Factory(list))


@attr.s
class Computation:
    index = attr.ib(converter=int)
    shortname = attr.ib(converter=str)
    fullname = attr.ib(converter=str)
    field = attr.ib(converter=str)
    isPostProcessed = attr.ib(converter=bool)
    inputs = attr.ib(default=attr.Factory(list))
    scale = attr.ib(default=attr.Factory(dict))

    is_reference = attr.ib(default=False)


@attr.s
class Config(object):
    parameters = attr.ib()
    predictand = attr.ib()
    observations = attr.ib()
    predictors = attr.ib()
    computations = attr.ib()

    @classmethod
    def from_dict(cls, data):
        return cls(
            parameters=Parameters(**data["parameters"]),
            predictand=Predictand(**data["predictand"]),
            observations=Observations(**data["observations"]),
            predictors=Predictors(**data["predictors"]),
            computations=[Computation(**field) for field in data["computations"]],
        )
