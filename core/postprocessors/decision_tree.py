from __future__ import print_function

import os

import attr
import numpy as np
import pandas


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

    def evaluate(self, predictor_matrix):
        for i in range(self.num_wt):
            thrL = self.thrL_out.ix[i, :]
            thrH = self.thrH_out.ix[i, :]
            self.evaluate_weather_type(thrL, thrH, predictor_matrix)

    def evaluate_weather_type(self, thrL, thrH, predictor_matrix):
        FER = predictor_matrix["FER"]
        title_pred = ""

        for thrL_label, thrH_label in zip(
            self.thrL_out.columns.tolist(), self.thrH_out.columns.tolist()
        ):
            thrL_temp = thrL[thrL_label]
            thrH_temp = thrH[thrH_label]

            predictor_shortname = thrL_label.replace("_thrL", "")

            temp_pred = predictor_matrix[predictor_shortname]

            mask = (temp_pred >= thrL_temp) & (temp_pred < thrH_temp)

            FER = FER[mask]
            predictor_matrix = predictor_matrix[mask]

            title_pred += "({low} <= {pred} < {high}) ".format(
                low=thrL_temp, pred=predictor_shortname, high=thrH_temp
            )

            return FER, title_pred
