import math
from base64 import b64encode
from io import BytesIO
from typing import Tuple

import attr
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
from colour import Color
from numpy import inf

from core.loaders import BasePointDataReader, ErrorType
from core.utils import int_or_float

from .conditional_verification import plot_avg, plot_obs_freq, plot_std
from .generics import Node


@attr.s(slots=True)
class DecisionTree(object):
    thrL_in = attr.ib()
    thrH_in = attr.ib()
    num_wt = attr.ib(default=None)

    @property
    def num_predictors(self):
        return len(self.thrL_in.columns)

    def get_threshold_counts(self):
        thresholds_num = np.zeros(self.num_predictors, dtype=int)
        thresholds_num_acc = np.zeros(self.num_predictors, dtype=int)
        acc = 1

        for i in range(self.num_predictors):
            temp = self.thrL_in.iloc[:, i].dropna()
            temp = temp[temp != ""]
            thresholds_num[i] = len(temp)
            acc = acc * len(temp)
            thresholds_num_acc[i] = acc

        return thresholds_num, thresholds_num_acc

    def create(self):
        thresholds_num, thresholds_num_acc = self.get_threshold_counts()
        self.num_wt = thresholds_num_acc[-1]

        dim = (self.num_wt, self.num_predictors)
        thrL_matrix = np.zeros(dim)
        thrH_matrix = np.zeros(dim)

        tempL = self.thrL_in.iloc[:, -1].dropna()
        tempL = tempL[tempL != ""]
        tempH = self.thrH_in.iloc[:, -1].dropna()
        tempH = tempH[tempH != ""]

        m = len(tempL)

        # Last column
        for i in range(0, self.num_wt, m):
            j = i + m
            thrL_matrix[i:j, -1] = tempL
            thrH_matrix[i:j, -1] = tempH

        # All left columns
        rep = 1
        for i in range(self.num_predictors - 2, -1, -1):
            tempL1 = self.thrL_in.iloc[:, i].dropna()
            tempL1 = tempL1[tempL1 != ""]
            tempH1 = self.thrH_in.iloc[:, i].dropna()
            tempH1 = tempH1[tempH1 != ""]
            m = len(tempL1)

            rep *= thresholds_num[i + 1]
            counter = 0

            if i == 0:
                for j in range(thresholds_num_acc[0]):
                    for k in range(m):
                        ind_i = counter
                        ind_f = counter + rep
                        tempL2 = tempL1[k]
                        tempH2 = tempH1[k]
                        thrL_matrix[ind_i:ind_f, i] = tempL2
                        thrH_matrix[ind_i:ind_f, i] = tempH2
                        counter = ind_f
            else:
                for j in range(thresholds_num_acc[i - 1]):
                    for k in range(m):
                        ind_i = counter
                        ind_f = counter + rep
                        tempL2 = tempL1[k]
                        tempH2 = tempH1[k]
                        thrL_matrix[ind_i:ind_f, i] = tempL2
                        thrH_matrix[ind_i:ind_f, i] = tempH2
                        counter = ind_f

        return (
            pd.DataFrame(data=thrL_matrix, columns=self.thrL_in.columns),
            pd.DataFrame(data=thrH_matrix, columns=self.thrH_in.columns),
        )

    @classmethod
    def construct_tree(cls, thrL_out, thrH_out):
        predictors = [predictor.replace("_thrL", "") for predictor in thrL_out.keys()]

        root = Node("Root")
        root.meta["level"] = -1

        num_wt = len(thrL_out)

        num_predictors = len(thrL_out.columns)

        leaf_color_codes = [
            color.hex
            for color in (
                Color("#f278f6"),
                Color("#d10330"),
                Color("#ea9826"),
                Color("#d0c912"),
                Color("#88c927"),
                Color("#359761"),
                Color("#2ad0ba"),
                Color("#4b8bab"),
                Color("#9797f4"),
                Color("#4d4ffa"),
            )
        ]

        if num_predictors > 10:
            leaf_color_codes += [
                color.hex
                for color in Color("#af0fff").range_to(
                    Color("#cb94ff"), num_predictors - 10
                )
            ]
        leaf_color_codes += [Color("black").hex]

        for i in range(num_wt):
            thrL = thrL_out.iloc[i, :]
            thrH = thrH_out.iloc[i, :]

            curr = root
            for level, (low, predictor, high) in enumerate(zip(thrL, predictors, thrH)):
                text = "{low} < {predictor} < {high}".format(
                    low=int_or_float(low), predictor=predictor, high=int_or_float(high)
                )
                parent = curr

                matched_node = next(
                    (child for child in parent.children if child.name == text), None
                )
                if matched_node:
                    curr = matched_node
                    continue
                else:
                    maybe_child = Node(text)
                    maybe_child.meta["predictor"] = predictor
                    maybe_child.meta["level"] = level
                    curr.meta["idxWT"] = i

                    # For a path in the decision tree that has been resolved, we want
                    # to add only those nodes to the tree that have a decision, i.e.
                    # a bounded range.
                    if not maybe_child.is_unbounded:
                        curr = maybe_child
                        parent.add_child(curr)

            if not curr.children:
                curr.meta["idxWT"] = i
                curr.nodeSvgShape = {
                    "shape": "circle",
                    "shapeProps": {
                        "r": 10,
                        "stroke": leaf_color_codes[curr.meta["level"]],
                    },
                }

        def codegen(node: Node, code: str):
            node.meta["code"] = code
            for idx, child in enumerate(node.children):
                lvl = child.meta["level"]
                codegen(node=child, code=code[:lvl] + str(idx + 1) + code[lvl + 1:])
            return node

        return codegen(node=root, code="0" * num_predictors)

    @classmethod
    def cal_rep_error(
        cls, loader: BasePointDataReader, thrL_out, thrH_out, nBin
    ) -> pd.DataFrame:
        num_wt = len(thrL_out)
        codes = cls.wt_code(thrL_out, thrH_out)
        rep_error = np.zeros((num_wt, nBin))
        a = np.arange(nBin)

        for i in range(num_wt):
            wt = WeatherType(
                thrL=thrL_out.iloc[i, :],
                thrH=thrH_out.iloc[i, :],
                thrL_labels=thrL_out.columns.tolist(),
                thrH_labels=thrH_out.columns.tolist(),
            )

            df, title = wt.evaluate(loader.error_type.name, loader=loader)
            error = df[loader.error_type.name].sort_values().to_numpy()

            centre_bin = (((2.0 * a) + 1) / (2.0 * nBin)) * len(error)

            for k in range(nBin):
                val = centre_bin[k]
                low, up = math.floor(val), math.ceil(val)

                if len(error) == 0:
                    rep_error[i][k] = -1
                    continue
                elif len(error) == 1:
                    low = up = 0
                elif up >= len(error):
                    up = len(error) - 1
                    low = up - 1

                low_val = error[low]
                up_val = error[up]
                w_low, w_up = 1 - abs(val - low), 1 - abs(val - up)

                rep_error[i][k] = ((low_val * w_low) + (up_val * w_up)) / (w_low + w_up)

        df = pd.DataFrame(data=rep_error, index=codes)
        return df.round(3)

    @classmethod
    def wt_code(cls, thrL_out, thrH_out):
        num_wt = len(thrL_out)
        num_pred = len(thrL_out.columns)
        wt = np.zeros((num_wt, num_pred))
        wt_arr = []
        wt_temp = ""
        for j in range(num_pred):
            if thrL_out.iloc[0, j] == -inf and thrH_out.iloc[0, j] == inf:
                wt[0][j] = 0
            elif thrL_out.iloc[0, j] == -inf and thrH_out.iloc[0, j] != inf:
                wt[0][j] = 1

            wt_temp += str(int(wt[0][j]))

        wt_arr.append(wt_temp)

        for i in range(1, num_wt):
            wt_temp = ""
            for j in range(num_pred):
                if thrL_out.iloc[i, j] == -inf and thrH_out.iloc[i, j] == inf:
                    wt[i][j] = 0
                elif thrL_out.iloc[i, j] == -inf and thrH_out.iloc[i, j] != inf:
                    wt[i][j] = 1
                else:
                    if (
                        thrL_out.iloc[i, j] == thrL_out.iloc[i - 1, j]
                        and thrH_out.iloc[i, j] == thrH_out.iloc[i - 1, j]
                    ):
                        wt[i][j] = wt[i - 1][j]
                    else:
                        wt[i][j] = wt[i - 1][j] + 1
                wt_temp += str(int(wt[i][j]))
            wt_arr.append(wt_temp)

        return wt_arr


@attr.s(slots=True)
class WeatherType(object):
    thrL = attr.ib()
    thrH = attr.ib()

    thrL_labels = attr.ib()
    thrH_labels = attr.ib()

    error_type: ErrorType = attr.ib(default=None)

    DEFAULT_FER_BINS = [
        -1.1,
        -0.99,
        -0.75,
        -0.5,
        -0.25,
        0.25,
        0.5,
        0.75,
        1,
        1.5,
        2,
        3,
        5,
        10,
        25,
        50,
        1000,
    ]

    def evaluate(
        self, *cols: str, loader: BasePointDataReader
    ) -> Tuple[pd.DataFrame, str]:
        self.error_type = loader.error_type

        if loader.cheaper:
            df: pd.DataFrame = loader.select(*cols, series=False)
        else:
            df: pd.DataFrame = loader.dataframe[list(cols)]

        title_pred = ""

        for thrL_label, thrH_label in zip(self.thrL_labels, self.thrH_labels):
            thrL_temp = self.thrL[thrL_label]
            thrH_temp = self.thrH[thrH_label]

            predictor_shortname = thrL_label.replace("_thrL", "")

            if loader.cheaper:
                temp_pred: pd.Series = loader.select(predictor_shortname)
            else:
                temp_pred: pd.Series = loader.dataframe[predictor_shortname]

            if thrL_temp > thrH_temp:
                # Case when predictor is periodic. For ex, Local Solar Time has
                # a period of 24 hours. It's possible to have the following
                # threshold splits:
                #   21 - 3   <- handles this case
                #    3 - 9
                #    9 - 15
                #   15 - 21
                mask = (temp_pred >= thrL_temp) | (temp_pred < thrH_temp)
            else:
                mask = (temp_pred >= thrL_temp) & (temp_pred < thrH_temp)

            df = df.loc[mask]

            title_pred += "({low} <= {pred} < {high}) ".format(
                low=int_or_float(thrL_temp),
                pred=predictor_shortname,
                high=int_or_float(thrH_temp),
            )

        return df, title_pred

    def _evaluate(self, predictors_matrix):
        """
        Deprecated decision tree evaluator, now replaced by evaluate().

        Algorithm is very similar to evaluate() with loader.cheaper=False.
        """
        self.error_type = (
            ErrorType.FER
            if ErrorType.FER.name in predictors_matrix
            else ErrorType.FE
        )

        error = predictors_matrix[self.error_type.name]
        title_pred = ""

        for thrL_label, thrH_label in zip(self.thrL_labels, self.thrH_labels):
            thrL_temp = self.thrL[thrL_label]
            thrH_temp = self.thrH[thrH_label]

            predictor_shortname = thrL_label.replace("_thrL", "")

            temp_pred = predictors_matrix[predictor_shortname]

            mask = (temp_pred >= thrL_temp) & (temp_pred < thrH_temp)

            error = error[mask]
            predictors_matrix = predictors_matrix[mask]

            title_pred += "({low} <= {pred} < {high}) ".format(
                low=int_or_float(thrL_temp),
                pred=predictor_shortname,
                high=int_or_float(thrH_temp),
            )

        return error.to_list(), predictors_matrix, title_pred

    def plot(self, data, bins: list, title, y_lim, out_path=None):
        matplotlib.style.use("seaborn")
        fig, ax = plt.subplots()
        plt.tight_layout(pad=5)

        ax.set_xlabel(
            f"{self.error_type.name} Bins {'[-]' if self.error_type == ErrorType.FER else ''}",
            fontsize=8,
        )
        ax.set_ylabel("Frequencies [%]", fontsize=8)
        ax.set_title(title, fontsize=8)

        ax.xaxis.set_tick_params(labelsize=7)
        ax.yaxis.set_tick_params(labelsize=7)

        ax.text(
            x=0.05,
            y=0.95,
            s=f"total = {human_format(data.count())}",
            transform=ax.transAxes,
            fontsize="x-small",
            verticalalignment="top",
            bbox=dict(boxstyle="round", facecolor="wheat", alpha=0.5),
        )

        # Add bias computation
        bias = self.error_type.bias(error=data, low=bins[0], high=bins[-1])
        ax.text(
            x=0.85,
            y=0.95,
            s=f"{bias:.2f}",
            transform=ax.transAxes,
            fontsize=24,
            verticalalignment="top",
        )

        out = pd.cut(data, bins=bins, include_lowest=True)
        series = out.value_counts(normalize=True, sort=False) * 100

        subplot = series.plot.bar(ax=ax, rot=45, ylim=(0, y_lim))
        patches = subplot.patches

        autolabel(ax, patches, y_cum=len(out))
        colorize_patches(patches, bins, self.error_type)

        if out_path:
            return fig.savefig(out_path, format="png")
        else:
            img = BytesIO()
            fig.savefig(img, format="png")
            img.seek(0)
            return b64encode(img.read()).decode()

    def plot_maps(self, data, code, mode):
        if mode == "a":
            return plot_obs_freq(data, code)
        if mode == "b":
            return plot_avg(data, code)
        if mode == "c":
            return plot_std(data, code)


def autolabel(ax, patches, y_cum):
    max_y_value = ax.get_ylim()[1]
    padding = max_y_value * 0.01

    for patch in patches:
        value = patch.get_height() * y_cum / 100.0
        if value == 0:
            continue

        text = human_format(value)

        text_x = patch.get_x() + patch.get_width() / 2
        text_y = patch.get_height() + padding

        ax.text(
            text_x, text_y, text, ha="center", va="bottom", color="black", fontsize=7
        )


def human_format(num):
    magnitude = 0
    while abs(num) >= 1000:
        magnitude += 1
        num /= 1000.0
    # add more suffixes if you need them

    format_value = "%.2f" % num
    if float(format_value) - int(float(format_value)) == 0:
        num = "%d" % num
    else:
        num = format_value

    return f'{num}{["", "K", "M", "G", "T", "P"][magnitude]}'


def colorize_patches(patches, bins, error_type: ErrorType):
    if error_type == ErrorType.FER:
        green = [i for i in bins if i < 0][:-1]
        yellow = [i for i in bins if (0 < i <= 2)][1:]

        green_patches, white_patches, yellow_patches, red_patches = (
            patches[: len(green)],
            patches[len(green) : len(green) + 1],
            patches[len(green) + 2 - 1 : len(green) + 2 + len(yellow)],
            patches[len(green) + 2 + len(yellow) - 1 :],
        )

        for patch in green_patches:
            patch.set_facecolor("#2ecc71")

        for patch in white_patches:
            patch.set_facecolor("#ffffff")
            patch.set_edgecolor("#000000")

        for patch in yellow_patches:
            patch.set_facecolor("#fef160")

        for patch in red_patches:
            patch.set_facecolor("#d64541")
    elif error_type == ErrorType.FE:
        blue = [i for i in bins if i < 0][:-1]
        blue_patches, white_patches, red_patches = (
            patches[: len(blue)],
            patches[len(blue) : len(blue) + 1],
            patches[len(blue) + 2 - 1 :],
        )

        for patch in blue_patches:
            patch.set_facecolor("#2c82c9")

        for patch in white_patches:
            patch.set_facecolor("#ffffff")
            patch.set_edgecolor("#000000")

        for patch in red_patches:
            patch.set_facecolor("#d64541")

    else:
        # Do not apply any color
        pass
