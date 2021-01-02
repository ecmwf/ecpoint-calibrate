from core.loaders import ErrorType, load_point_data_by_path
from core.postprocessors.decision_tree import WeatherType


def get_pdt_statistics(path: str) -> dict:
    loader = load_point_data_by_path(path)

    fields = loader.predictors

    def get_field_summary(name: str) -> dict:
        df = loader.select(name)
        return dict(
            name=name,
            min=f"{df.min():.2f}",
            max=f"{df.max():.2f}",
            mean=f"{df.mean():.2f}",
            median=f"{df.median():.2f}",
            count=f"{int(df.count())}",
        )

    summary = [get_field_summary(field) for field in fields + [loader.error_type.name]]

    error_count = next(
        each["count"] for each in summary if each["name"] == loader.error_type.name
    )

    return dict(
        fields=fields,
        summary=summary,
        count=error_count,
        error=loader.error_type.name,
        bins=WeatherType.DEFAULT_FER_BINS if loader.error_type == ErrorType.FER else [],
    )
