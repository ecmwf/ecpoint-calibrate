const defaultState = {
  bins: [],
  minValue: null,
  maxValue: null,
  count: null,
  error: null,
  summary: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'BINNING.SET_BINS': {
      return { ...state, bins: action.data }
    }

    case 'BINNING.SET_POINT_DATA_META_FIELDS': {
      return {
        ...state,
        minValue: action.minValue,
        maxValue: action.maxValue,
        count: action.count,
        error: action.error,
        bins: action.bins,
        summary: action.summary,
      }
    }

    default: {
      return state
    }
  }
}
