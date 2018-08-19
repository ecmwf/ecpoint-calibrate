import os

import pandas
import numpy as np

from core.postprocessors.decision_tree import DecisionTree

from .conf import TEST_DATA_DIR


def test_decision_tree_with_predefined_threshold_splits():
    records = [
        ("-inf", "0.25", "-inf", "2", "5", "20", "-inf", "inf", "-inf", "70"),
        ("", "", "", "", "20", "inf", "", "", "70", "275"),
        ("", "", "", "", "", "", "", "", "275", "inf"),
    ]

    labels = [
        "CPR_thrL",
        "CPR_thrH",
        "TP_thrL",
        "TP_thrH",
        "WSPD_thrL",
        "WSPD_thrH",
        "CAPE_thrL",
        "CAPE_thrH",
        "SR_thrL",
        "SR_thrH",
    ]

    df = pandas.DataFrame.from_records(records, columns=labels)

    thrL, thrH = df.iloc[:, ::2], df.iloc[:, 1::2]
    dt = DecisionTree(thrL_in=thrL, thrH_in=thrH)
    dt.create()

    # root = dt.construct_tree()

    expected_thrL_matrix = [
        [float("-inf"), float("-inf"), 5., float("-inf"), float("-inf")],
        [float("-inf"), float("-inf"), 5., float("-inf"), 70.],
        [float("-inf"), float("-inf"), 5., float("-inf"), 275.],
        [float("-inf"), float("-inf"), 20., float("-inf"), float("-inf")],
        [float("-inf"), float("-inf"), 20., float("-inf"), 70.],
        [float("-inf"), float("-inf"), 20., float("-inf"), 275.],
    ]
    assert np.array_equal(dt.thrL_out, expected_thrL_matrix)

    expected_thrH_matrix = [
        [0.25, 2., 20., float("inf"), 70.],
        [0.25, 2., 20., float("inf"), 275.],
        [0.25, 2., 20., float("inf"), float("inf")],
        [0.25, 2., float("inf"), float("inf"), 70.],
        [0.25, 2., float("inf"), float("inf"), 275.],
        [0.25, 2., float("inf"), float("inf"), float("inf")],
    ]
    assert np.array_equal(dt.thrH_out, expected_thrH_matrix)
