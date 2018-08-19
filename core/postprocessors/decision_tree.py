from __future__ import print_function

import os
from base64 import b64encode
from io import BytesIO

import attr
import matplotlib
import matplotlib.pyplot as plt
import numpy as np
import pandas

from ..utils import tolist


@attr.s(slots=True)
class DecisionTree(object):
    thrL_in = attr.ib()
    thrH_in = attr.ib()

    thrL_out = attr.ib(default=None)
    thrH_out = attr.ib(default=None)

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

        self.thrL_out = pandas.DataFrame(data=thrL_matrix, columns=self.thrL_in.columns)
        self.thrH_out = pandas.DataFrame(data=thrH_matrix, columns=self.thrH_in.columns)

        print(self)

    def __str__(self):
        if self.thrL_out is None:
            return super(DecisionTree, self).__str__()

        out = ""

        for i in range(self.num_wt):
            out += "Weather Type {}\n".format(i)
            for j in range(self.num_predictors):
                out += "    Level {num}: {low} <= PREDICTOR < {high}\n".format(
                    num=j, low=self.thrL_out.ix[i, j], high=self.thrH_out.ix[i, j]
                )
            out += "\n"

        return out

    def construct_tree(self, predictor_matrix):
        root = Node(None)
        for i in range(self.num_wt):
            thrL = self.thrL_out.ix[i, :]
            thrH = self.thrH_out.ix[i, :]
            wt = WeatherType(
                thrL=thrL,
                thrH=thrH,
                thrL_labels=self.thrL_out.columns.tolist(),
                thrH_labels=self.thrH_out.columns.tolist(),
            )
            graph = wt.evaluate(predictor_matrix)

            predictors = [predictor.replace("_thrL", "") for predictor in thrL.keys()]

            curr = root
            for low, predictor, high in zip(thrL, predictors, thrH):
                text = "{low} < {predictor} < {high}".format(
                    low=low, high=high, predictor=predictor
                )
                parent = curr

                matches = [child for child in parent.children if child.name == text]
                if any(matches):
                    curr = matches[0]
                    continue
                else:
                    curr = Node(text)
                    parent.children.append(curr)

            if not curr.children:
                curr.meta["graph"] = graph

        return root


@attr.s(slots=True)
class WeatherType(object):
    thrL = attr.ib()
    thrH = attr.ib()

    thrL_labels = attr.ib()
    thrH_labels = attr.ib()

    def evaluate(self, predictors_matrix):
        FER = predictors_matrix["FER"]
        title_pred = ""

        for thrL_label, thrH_label in zip(self.thrL_labels, self.thrH_labels):
            thrL_temp = self.thrL[thrL_label]
            thrH_temp = self.thrH[thrH_label]

            predictor_shortname = thrL_label.replace("_thrL", "")

            temp_pred = predictors_matrix[predictor_shortname]

            mask = (temp_pred >= thrL_temp) & (temp_pred < thrH_temp)

            FER = FER[mask]
            predictors_matrix = predictors_matrix[mask]

            title_pred += "({low} <= {pred} < {high}) ".format(
                low=thrL_temp, pred=predictor_shortname, high=thrH_temp
            )

        return self.plot(FER, title_pred)

    @staticmethod
    def plot(data, title):
        matplotlib.style.use("seaborn")
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

        out = pandas.cut(data, bins=bins, include_lowest=True)
        ax = out.value_counts(sort=False).plot.bar()

        plt.xlabel("FER Bins")
        plt.ylabel("Frequencies")
        plt.title("Weather type: " + title, fontsize=10)
        plt.tight_layout()

        img = BytesIO()
        plt.savefig(img, format="png")
        img.seek(0)
        return b64encode(img.read())


@attr.s
class Node(object):
    name = attr.ib()
    children = attr.ib(default=attr.Factory(list))
    meta = attr.ib(default=attr.Factory(dict))

    @property
    def json(self):
        return attr.asdict(self)
