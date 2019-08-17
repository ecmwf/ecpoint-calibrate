import math
from base64 import b64encode
from io import BytesIO

import attr
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas
from numpy import inf

from .generics import Node

matplotlib.style.use("seaborn")


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
            temp = self.thrL_in.ix[:, i].dropna()
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

        tempL = self.thrL_in.ix[:, -1].dropna()
        tempL = tempL[tempL != ""]
        tempH = self.thrH_in.ix[:, -1].dropna()
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
            tempL1 = self.thrL_in.ix[:, i].dropna()
            tempL1 = tempL1[tempL1 != ""]
            tempH1 = self.thrH_in.ix[:, i].dropna()
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
            pandas.DataFrame(data=thrL_matrix, columns=self.thrL_in.columns),
            pandas.DataFrame(data=thrH_matrix, columns=self.thrH_in.columns),
        )

    # def __str__(self):
    #    if thrL_out is None:
    #         return super(DecisionTree, self).__str__()
    #
    #     out = ""
    #
    #     for i in range(self.num_wt):
    #         out += "Weather Type {}\n".format(i)
    #         for j in range(self.num_predictors):
    #             out += "    Level {num}: {low} <= PREDICTOR < {high}\n".format(
    #                 num=j, low=thrL_out.ix[i, j], high=thrH_out.ix[i, j]
    #             )
    #         out += "\n"
    #
    #     return out

    @classmethod
    def construct_tree(cls, thrL_out, thrH_out):
        root = Node("Root")
        num_wt = len(thrL_out)

        for i in range(num_wt):
            thrL = thrL_out.ix[i, :]
            thrH = thrH_out.ix[i, :]

            predictors = [predictor.replace("_thrL", "") for predictor in thrL.keys()]

            curr = root
            for low, predictor, high in zip(thrL, predictors, thrH):
                text = "{low} < {predictor} < {high}".format(
                    low=low, high=high, predictor=predictor
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
                    # For a path in the decision tree that has been resolved, we want
                    # to add only those nodes to the tree that have a decision, i.e.
                    # a bounded range.
                    #
                    # An exception is when we're adding a node to the Root.
                    if parent.is_root or not maybe_child.is_unbounded:
                        curr = maybe_child
                        parent.add_child(curr)

            if not curr.children:
                curr.meta["idxWT"] = i
                code = cls.wt_code(thrL_out, thrH_out)[i]
                curr.meta["code"] = code

        return root

    @classmethod
    def cal_rep_error(cls, predictors_matrix, thrL_out, thrH_out, nBin):
        num_wt = len(thrL_out)
        rep_error = np.zeros((num_wt, nBin))
        a = np.arange(nBin)

        for i in range(num_wt):
            wt = WeatherType(
                thrL=thrL_out.ix[i, :],
                thrH=thrH_out.ix[i, :],
                thrL_labels=thrL_out.columns.tolist(),
                thrH_labels=thrH_out.columns.tolist(),
            )

            error, _ = wt.evaluate(predictors_matrix)
            error = sorted(error)

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

        return rep_error

    @classmethod
    def wt_code(cls, thrL_out, thrH_out):
        num_wt = len(thrL_out)
        num_pred = len(thrL_out.columns)
        wt = np.zeros((num_wt, num_pred))
        wt_arr = []
        wt_temp = ""
        for j in range(num_pred):
            if thrL_out.ix[0, j] == -inf and thrH_out.ix[0, j] == inf:
                wt[0][j] = 0
            elif thrL_out.ix[0, j] == -inf and thrH_out.ix[0, j] != inf:
                wt[0][j] = 1

            wt_temp += str(int(wt[0][j]))

        wt_arr.append(wt_temp)

        for i in range(1, num_wt):
            wt_temp = ""
            for j in range(num_pred):
                if thrL_out.ix[i, j] == -inf and thrH_out.ix[i, j] == inf:
                    wt[i][j] = 0
                elif thrL_out.ix[i, j] == -inf and thrH_out.ix[i, j] != inf:
                    wt[i][j] = 1
                else:
                    if (
                        thrL_out.ix[i][j] == thrL_out.ix[i - 1][j]
                        and thrH_out.ix[i][j] == thrH_out.ix[i - 1][j]
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

    def evaluate_dt_and_generate_hist(self, predictors_matrix):
        error, title = self.evaluate(predictors_matrix)
        return self.plot(error, title)

    def evaluate(self, predictors_matrix):
        error = predictors_matrix["FER"]
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
                low=thrL_temp, pred=predictor_shortname, high=thrH_temp
            )

        return error.to_list(), title_pred

    @staticmethod
    def plot(data, title):
        bins = [
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

        fig, ax = plt.subplots()

        ax.set_xlabel("FER Bins", fontsize=8)
        ax.set_ylabel("Frequencies", fontsize=8)
        ax.set_title(title, fontsize=8)

        ax.xaxis.set_tick_params(labelsize=7)
        ax.yaxis.set_tick_params(labelsize=7)

        out = pandas.cut(data, bins=bins, include_lowest=True)
        subplot = out.value_counts().plot.bar(ax=ax, rot=45)
        patches = subplot.patches

        label_bars(ax, patches)

        green_patches, white_patches, yellow_patches, red_patches = (
            patches[:4],
            patches[4:5],
            patches[5:10],
            patches[10:],
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

        img = BytesIO()
        fig.savefig(img, format="png")
        img.seek(0)
        return b64encode(img.read()).decode()


def label_bars(ax, bars):
    max_y_value = ax.get_ylim()[1]
    padding = max_y_value * 0.01

    for bar in bars:
        value = bar.get_height()
        if value == 0:
            continue

        text = value
        text_x = bar.get_x() + bar.get_width() / 2
        text_y = bar.get_height() + padding

        ax.text(
            text_x, text_y, text, ha="center", va="bottom", color="black", fontsize=7
        )
