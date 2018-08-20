const defaultState = {
  thrGridIn: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'POSTPROCESSING.SET_THRESHOLD_SPLITS': {
      return { ...state, thrGridIn: action.grid }
    }

    default: {
      return state
    }
  }
}
