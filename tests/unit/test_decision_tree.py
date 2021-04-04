import numpy as np
import pandas
import pytest

from core.postprocessors.decision_tree import DecisionTree
from tests.unit.utils import strip_node_shape

inf = float("inf")


@pytest.fixture
def sparse_breakpoints():
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
    return df.iloc[:, ::2], df.iloc[:, 1::2]


@pytest.fixture
def breakpoints():
    matrix = [
        [-inf, 0.25, -inf, 2.0, -inf, 5.0, -inf, inf, -inf, 70.0],
        [-inf, 0.25, -inf, 2.0, -inf, 5.0, -inf, inf, 70.0, 275.0],
        [-inf, 0.25, -inf, 2.0, -inf, 5.0, -inf, inf, 275.0, inf],
        [-inf, 0.25, -inf, 2.0, 5.0, 20.0, -inf, inf, -inf, 70.0],
        [-inf, 0.25, -inf, 2.0, 5.0, 20.0, -inf, inf, 70.0, 275.0],
        [-inf, 0.25, -inf, 2.0, 5.0, 20.0, -inf, inf, 275.0, inf],
        [-inf, 0.25, -inf, 2.0, 20.0, inf, -inf, inf, -inf, 70.0],
        [-inf, 0.25, -inf, 2.0, 20.0, inf, -inf, inf, 70.0, 275.0],
        [-inf, 0.25, -inf, 2.0, 20.0, inf, -inf, inf, 275.0, inf],
        [-inf, 0.25, 2.0, inf, -inf, 5.0, -inf, inf, -inf, 70.0],
        [-inf, 0.25, 2.0, inf, -inf, 5.0, -inf, inf, 70.0, 275.0],
        [-inf, 0.25, 2.0, inf, -inf, 5.0, -inf, inf, 275.0, inf],
        [-inf, 0.25, 2.0, inf, 5.0, 20.0, -inf, inf, -inf, 70.0],
        [-inf, 0.25, 2.0, inf, 5.0, 20.0, -inf, inf, 70.0, 275.0],
        [-inf, 0.25, 2.0, inf, 5.0, 20.0, -inf, inf, 275.0, inf],
        [-inf, 0.25, 2.0, inf, 20.0, inf, -inf, inf, -inf, 70.0],
        [-inf, 0.25, 2.0, inf, 20.0, inf, -inf, inf, 70.0, 275.0],
        [-inf, 0.25, 2.0, inf, 20.0, inf, -inf, inf, 275.0, inf],
        [0.25, inf, -inf, 2.0, -inf, 5.0, -inf, inf, -inf, 70.0],
        [0.25, inf, -inf, 2.0, -inf, 5.0, -inf, inf, 70.0, 275.0],
        [0.25, inf, -inf, 2.0, -inf, 5.0, -inf, inf, 275.0, inf],
        [0.25, inf, -inf, 2.0, 5.0, 20.0, -inf, inf, -inf, 70.0],
        [0.25, inf, -inf, 2.0, 5.0, 20.0, -inf, inf, 70.0, 275.0],
        [0.25, inf, -inf, 2.0, 5.0, 20.0, -inf, inf, 275.0, inf],
        [0.25, inf, -inf, 2.0, 20.0, inf, -inf, inf, -inf, 70.0],
        [0.25, inf, -inf, 2.0, 20.0, inf, -inf, inf, 70.0, 275.0],
        [0.25, inf, -inf, 2.0, 20.0, inf, -inf, inf, 275.0, inf],
        [0.25, inf, 2.0, inf, -inf, 5.0, -inf, inf, -inf, 70.0],
        [0.25, inf, 2.0, inf, -inf, 5.0, -inf, inf, 70.0, 275.0],
        [0.25, inf, 2.0, inf, -inf, 5.0, -inf, inf, 275.0, inf],
        [0.25, inf, 2.0, inf, 5.0, 20.0, -inf, inf, -inf, 70.0],
        [0.25, inf, 2.0, inf, 5.0, 20.0, -inf, inf, 70.0, 275.0],
        [0.25, inf, 2.0, inf, 5.0, 20.0, -inf, inf, 275.0, inf],
        [0.25, inf, 2.0, inf, 20.0, inf, -inf, inf, -inf, 70.0],
        [0.25, inf, 2.0, inf, 20.0, inf, -inf, inf, 70.0, 275.0],
        [0.25, inf, 2.0, inf, 20.0, inf, -inf, inf, 275.0, inf],
    ]

    labels = [
        "cpr_thrL",
        "cpr_thrH",
        "tp_acc_thrL",
        "tp_acc_thrH",
        "cp_acc_thrL",
        "cp_acc_thrH",
        "cape_wa_thrL",
        "cape_wa_thrH",
        "sr24h_thrL",
        "sr24h_thrH",
    ]

    df = pandas.DataFrame.from_records(matrix, columns=labels)
    return df.iloc[:, ::2], df.iloc[:, 1::2]


def test_decision_tree_with_predefined_threshold_splits(sparse_breakpoints):
    thrL, thrH = sparse_breakpoints
    dt = DecisionTree(thrL_in=thrL, thrH_in=thrH)
    thrL_out, thrH_out = dt.create()

    # root = dt.construct_tree()

    expected_thrL_matrix = [
        [float("-inf"), float("-inf"), 5.0, float("-inf"), float("-inf")],
        [float("-inf"), float("-inf"), 5.0, float("-inf"), 70.0],
        [float("-inf"), float("-inf"), 5.0, float("-inf"), 275.0],
        [float("-inf"), float("-inf"), 20.0, float("-inf"), float("-inf")],
        [float("-inf"), float("-inf"), 20.0, float("-inf"), 70.0],
        [float("-inf"), float("-inf"), 20.0, float("-inf"), 275.0],
    ]
    assert np.array_equal(thrL_out, expected_thrL_matrix)

    expected_thrH_matrix = [
        [0.25, 2.0, 20.0, float("inf"), 70.0],
        [0.25, 2.0, 20.0, float("inf"), 275.0],
        [0.25, 2.0, 20.0, float("inf"), float("inf")],
        [0.25, 2.0, float("inf"), float("inf"), 70.0],
        [0.25, 2.0, float("inf"), float("inf"), 275.0],
        [0.25, 2.0, float("inf"), float("inf"), float("inf")],
    ]
    assert np.array_equal(thrH_out, expected_thrH_matrix)


def test_decision_tree_construction(breakpoints):
    thrL, thrH = breakpoints
    tree = DecisionTree.construct_tree(thrL_out=thrL, thrH_out=thrH)

    expected = {
        "name": "Root",
        "children": [
            {
                "name": "-inf < cpr < 0.25",
                "children": [
                    {
                        "name": "-inf < tp_acc < 2",
                        "children": [
                            {
                                "name": "-inf < cp_acc < 5",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 0,
                                            "code": "11101",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 1,
                                            "code": "11102",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 2,
                                            "code": "11103",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 2,
                                    "code": "11103",
                                },
                            },
                            {
                                "name": "5 < cp_acc < 20",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 3,
                                            "code": "11201",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 4,
                                            "code": "11202",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 5,
                                            "code": "11203",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 5,
                                    "code": "11203",
                                },
                            },
                            {
                                "name": "20 < cp_acc < inf",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 6,
                                            "code": "11301",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 7,
                                            "code": "11302",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 8,
                                            "code": "11303",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 8,
                                    "code": "11303",
                                },
                            },
                        ],
                        "parent": None,
                        "meta": {
                            "predictor": "tp_acc",
                            "level": 1,
                            "idxWT": 6,
                            "code": "11301",
                        },
                    },
                    {
                        "name": "2 < tp_acc < inf",
                        "children": [
                            {
                                "name": "-inf < cp_acc < 5",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 9,
                                            "code": "12101",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 10,
                                            "code": "12102",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 11,
                                            "code": "12103",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 11,
                                    "code": "12103",
                                },
                            },
                            {
                                "name": "5 < cp_acc < 20",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 12,
                                            "code": "12201",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 13,
                                            "code": "12202",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 14,
                                            "code": "12203",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 14,
                                    "code": "12203",
                                },
                            },
                            {
                                "name": "20 < cp_acc < inf",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 15,
                                            "code": "12301",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 16,
                                            "code": "12302",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 17,
                                            "code": "12303",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 17,
                                    "code": "12303",
                                },
                            },
                        ],
                        "parent": None,
                        "meta": {
                            "predictor": "tp_acc",
                            "level": 1,
                            "idxWT": 15,
                            "code": "12301",
                        },
                    },
                ],
                "parent": None,
                "meta": {"predictor": "cpr", "level": 0, "idxWT": 9, "code": "12101"},
            },
            {
                "name": "0.25 < cpr < inf",
                "children": [
                    {
                        "name": "-inf < tp_acc < 2",
                        "children": [
                            {
                                "name": "-inf < cp_acc < 5",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 18,
                                            "code": "21101",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 19,
                                            "code": "21102",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 20,
                                            "code": "21103",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 20,
                                    "code": "21103",
                                },
                            },
                            {
                                "name": "5 < cp_acc < 20",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 21,
                                            "code": "21201",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 22,
                                            "code": "21202",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 23,
                                            "code": "21203",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 23,
                                    "code": "21203",
                                },
                            },
                            {
                                "name": "20 < cp_acc < inf",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 24,
                                            "code": "21301",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 25,
                                            "code": "21302",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 26,
                                            "code": "21303",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 26,
                                    "code": "21303",
                                },
                            },
                        ],
                        "parent": None,
                        "meta": {
                            "predictor": "tp_acc",
                            "level": 1,
                            "idxWT": 24,
                            "code": "21301",
                        },
                    },
                    {
                        "name": "2 < tp_acc < inf",
                        "children": [
                            {
                                "name": "-inf < cp_acc < 5",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 27,
                                            "code": "22101",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 28,
                                            "code": "22102",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 29,
                                            "code": "22103",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 29,
                                    "code": "22103",
                                },
                            },
                            {
                                "name": "5 < cp_acc < 20",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 30,
                                            "code": "22201",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 31,
                                            "code": "22202",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 32,
                                            "code": "22203",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 32,
                                    "code": "22203",
                                },
                            },
                            {
                                "name": "20 < cp_acc < inf",
                                "children": [
                                    {
                                        "name": "-inf < sr24h < 70",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 33,
                                            "code": "22301",
                                        },
                                    },
                                    {
                                        "name": "70 < sr24h < 275",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 34,
                                            "code": "22302",
                                        },
                                    },
                                    {
                                        "name": "275 < sr24h < inf",
                                        "children": [],
                                        "parent": None,
                                        "meta": {
                                            "predictor": "sr24h",
                                            "level": 4,
                                            "idxWT": 35,
                                            "code": "22303",
                                        },
                                    },
                                ],
                                "parent": None,
                                "meta": {
                                    "predictor": "cp_acc",
                                    "level": 2,
                                    "idxWT": 35,
                                    "code": "22303",
                                },
                            },
                        ],
                        "parent": None,
                        "meta": {
                            "predictor": "tp_acc",
                            "level": 1,
                            "idxWT": 33,
                            "code": "22301",
                        },
                    },
                ],
                "parent": None,
                "meta": {"predictor": "cpr", "level": 0, "idxWT": 27, "code": "22101"},
            },
        ],
        "parent": None,
        "meta": {"level": -1, "idxWT": 18, "code": "21101"},
    }

    assert strip_node_shape(tree.json) == expected
