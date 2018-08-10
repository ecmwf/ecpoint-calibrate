import os

import pandas
import numpy as np

from core.processing.decision_tree import DecisionTree

from .conf import TEST_DATA_DIR


def test_decision_tree_with_predefined_threshold_splits():
    df = pandas.read_csv(
        os.path.join(TEST_DATA_DIR, 'WeatherTypes.csv'),
        sep='\t'
    )

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
