from base64 import b64encode
from io import BytesIO

import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from matplotlib.ticker import AutoMinorLocator
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

    breakpoints_idx = np.round(np.linspace(0, len(df) - 1, breakpoints_num + 2)).astype(
        int
    )[1:-1]
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

    return df_result


def format_ks_stats(df: pd.DataFrame) -> pd.DataFrame:
    df["breakpoint"] = df["breakpoint"].apply(lambda x: f"{x:0.4f}")
    df["pValue"] = df["pValue"].apply(lambda x: f"{x:0.4f}")
    df["dStatValue"] = df["dStatValue"].apply(lambda x: f"{x:0.4f}")

    return df


def plot_ks_stats(df: pd.DataFrame, node: str, predictor: str):
    matplotlib.style.use("default")
    fig, ax1 = plt.subplots()

    color = "tab:red"
    ax1.set_xlabel(f"Breakpoints for {predictor}")
    ax1.set_ylabel("K-S DStat", color=color)
    ax1.plot(df["breakpoint"], df["dStatValue"], color=color, marker="o", markersize=4)
    ax1.tick_params(axis="y", labelcolor=color)

    ax2 = ax1.twinx()  # instantiate a second axes that shares the same x-axis

    color = "tab:blue"
    ax2.set_ylabel("ln(pValue)", color=color)  # we already handled the x-label with ax1
    ax2.plot(df["breakpoint"], df["pValue"], color=color, marker="o", markersize=4)
    ax2.tick_params(axis="y", labelcolor=color)

    # Set minor ticks
    ax1.xaxis.set_minor_locator(AutoMinorLocator())
    ax1.yaxis.set_minor_locator(AutoMinorLocator())
    ax2.yaxis.set_minor_locator(AutoMinorLocator())

    # Set main title of graph
    ax1.set_title(node, fontsize=8)

    fig.tight_layout()  # otherwise the right y-label is slightly clipped

    img = BytesIO()
    fig.savefig(img, format="png")
    img.seek(0)
    return b64encode(img.read()).decode()
