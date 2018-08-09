import os

import numpy as np
import attr


@attr.s(slots=True)
class DecisionTree(object):
    thrL = attr.ib()
    thrH = attr.ib()

    @property
    def num_predictors(self):
        return len(self.thrL.columns)
    
    def get_threshold_counts(self):
        thresholds_num = np.zeros(self.num_predictors, dtype=int)
        thresholds_num_acc = np.zeros(self.num_predictors, dtype=int)
        acc = 1

        for i in range(self.num_predictors):
            temp = self.thrL.ix[:,i].dropna()
            thresholds_num[i] = len(temp)
            acc = acc * len(temp)
            thresholds_num_acc[i] = acc

        return thresholds_num, thresholds_num_acc

    def create(self):
        thresholds_num, thresholds_num_acc = self.get_threshold_counts()
        num_weather_types = thresholds_num_acc[-1]

        dim = (num_weather_types, self.num_predictors,)
        thrL_matrix = np.zeros(dim)
        thrH_matrix = np.zeros(dim)

        tempL = self.thrL.ix[:,-1].dropna()
        tempH = self.thrH.ix[:,-1].dropna()

        m = len(tempL)

        # Last column
        for i in range(0, num_weather_types, m):
            j = i + m
            thrL_matrix[i:j,-1] = tempL
            thrH_matrix[i:j,-1] = tempH

        # All left columns
        rep = 1
        for i in range(self.num_predictors - 2, -1, -1):
            tempL1 = self.thrL.ix[:,i].dropna()
            tempH1 = self.thrH.ix[:,i].dropna()
            m = len(tempL1)

            rep *= thresholds_num[i+1]
            counter = 0
    
            if i == 0:
                for j in range(thresholds_num_acc[0]):
                    for k in range(m):
                        ind_i = counter
                        ind_f = counter + rep
                        tempL2 = tempL1[k]
                        tempH2 = tempH1[k]
                        thrL_matrix[ind_i:ind_f,i] = tempL2
                        thrH_matrix[ind_i:ind_f,i] = tempH2
                        counter = ind_f
            else:
                for j in range(thresholds_num_acc[i-1]):
                    for k in range(m):
                        ind_i = counter
                        ind_f = counter + rep
                        tempL2 = tempL1[k]
                        tempH2 = tempH1[k]
                        thrL_matrix[ind_i:ind_f,i] = tempL2
                        thrH_matrix[ind_i:ind_f,i] = tempH2
                        counter = ind_f

        return thrL_matrix, thrH_matrix


if __name__ == '__main__':
    import pandas
    df = pandas.read_csv(
        os.path.join(os.path.dirname(__file__), 'WeatherTypes.csv'),
        sep='\t'
    )
    np.set_printoptions(suppress=True)
    thrL, thrH = df.iloc[:, ::2], df.iloc[:, 1::2]
    dt = DecisionTree(thrL=thrL, thrH=thrH)
    thrL_matrix, thrH_matrix = dt.create()
  
    expected_thrL_matrix = [[-9999., -9999.,  5., -9999., -9999.],
                            [-9999., -9999.,  5., -9999.,    70.],
                            [-9999., -9999.,  5., -9999.,   275.],
                            [-9999., -9999., 20., -9999., -9999.],
                            [-9999., -9999., 20., -9999.,    70.],
                            [-9999., -9999., 20., -9999.,   275.]]
    assert np.array_equal(thrL_matrix, expected_thrL_matrix)

    expected_thrH_matrix = [[0.25, 2., 20., 9999., 70.],
                            [0.25, 2.,   20., 9999.,  275.],
                            [0.25, 2.,   20., 9999., 9999.],
                            [0.25, 2., 9999., 9999.,   70.],
                            [0.25, 2., 9999., 9999.,  275.],
                            [0.25, 2., 9999., 9999., 9999.]]
    assert np.array_equal(thrH_matrix, expected_thrH_matrix)


