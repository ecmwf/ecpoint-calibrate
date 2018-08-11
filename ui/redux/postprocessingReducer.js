const defaultState = {
  thresholdSplitsGrid: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'POSTPROCESSING.SET_THRESHOLD_SPLITS': {
      return { ...state, thresholdSplitsGrid: action.grid }
    }

    default: {
      return state
    }
  }
}
