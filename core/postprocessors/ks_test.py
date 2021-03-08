import numpy as np
import pandas as pd
from scipy.stats import ks_2samp


def ks_test_engine(
    df: pd.DataFrame,
    predictor_name: str,
    error_name: str,
    breakpoints_num: int,
    lower_bound: float = None,
    upper_bound: float = None,
):
    if lower_bound is not None:
        df = df.loc[df[predictor_name] >= lower_bound]

    if upper_bound is not None:
        df = df.loc[df[predictor_name] <= upper_bound]

    df = df.sort_values(by=predictor_name)
    predictor = df[predictor_name]

    breakpoints_idx = np.round(np.linspace(0, len(df) - 1, breakpoints_num)).astype(int)
    breakpoints: np.ndarray = np.unique(predictor.to_numpy().take(breakpoints_idx))

    df_result = pd.DataFrame(breakpoints, columns=["breakpoint"])
    df_result["pValue"] = np.zeros(len(breakpoints))
    df_result["dStatValue"] = np.zeros(len(breakpoints))

    df_result.sort_values("breakpoint", inplace=True)

    low, high = predictor.min(), predictor.max()

    for idx, row in df_result.iterrows():
        bp = row["breakpoint"]

        data2test_1 = df.loc[(predictor >= low) & (predictor < bp)][error_name]
        data2test_2 = df.loc[(predictor >= bp) & (predictor <= high)][error_name]

        if len(data2test_1) != 0 and len(data2test_2) != 0:
            statistic, pvalue = ks_2samp(data2test_1, data2test_2)

            df_result.at[idx, "pValue"] = -1 * np.log(pvalue)
            df_result.at[idx, "dStatValue"] = statistic

    df_result["breakpoint"] = df_result["breakpoint"].apply(lambda x: f"{x:0.4f}")
    df_result["pValue"] = df_result["pValue"].apply(lambda x: f"{x:0.4f}")
    df_result["dStatValue"] = df_result["dStatValue"].apply(lambda x: f"{x:0.4f}")

    return df_result
