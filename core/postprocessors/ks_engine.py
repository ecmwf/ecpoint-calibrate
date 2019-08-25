from numpy import inf
from scipy.stats import ks_2samp


def find_next_breakpoint(series, value):
    position = series[series == value].index[0]

    if position == len(series) - 1:
        return inf
    else:
        return series.iloc[position + 1]


class KolmogorovSmirnovEngine:
    def run(self, predictor, error, PosAll, PosBP):
        breakpoints = []
        pos1 = PosBP[0]
        pos2 = PosBP[1]
        pos3 = PosBP[2]

        SubS1 = error[(PosAll >= pos1) & (PosAll < pos2)]
        SubS2 = error[(PosAll >= pos2) & (PosAll < pos3)]

        while pos3 <= PosBP.iloc[-1]:
            stat = ks_2samp(SubS1, SubS2)

            if stat.pvalue <= 0.01:  # The test rejects the null hypothesis
                thr = predictor.iloc[pos2]
                breakpoints.append(thr)

                pos1 = pos2
                pos2 = pos3
                pos3 = find_next_breakpoint(PosBP, pos3)
            else:  # The test does not reject the null hypothesis
                pos2 = pos3
                pos3 = find_next_breakpoint(PosBP, pos3)

            SubS1 = error[(PosAll >= pos1) & (PosAll < pos2)]
            SubS2 = error[(PosAll >= pos2) & (PosAll < pos3)]

        return breakpoints
