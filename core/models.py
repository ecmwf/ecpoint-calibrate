import attr


@attr.s
class Parameters(object):
    # start base date of the forecast (in YYYYMMDD format)
    date_start = attr.ib(converter=str)

    # final base date of the forecast (in YYYYMMDD format)
    date_end = attr.ib(converter=str)

    # upper limit (in hours) of the window in forecast with spin-up problems
    limit_spin_up = attr.ib(converter=int)

    # range for the leadtime (in hours)
    leadstart_range = attr.ib(converter=int)

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


@attr.s
class Predictors(object):
    # path of the database that contains the parameter to post-process and the
    # predictors
    path = attr.ib(converter=str)

    codes = attr.ib(default=attr.Factory(list))


@attr.s
class Computations(object):
    fields = attr.ib(default=attr.Factory(list))


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
            computations=Computations(**data["computations"]),
        )
