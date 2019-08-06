const defaultState = {
  path: null,
  codes: [],
  sampling_interval: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PREDICTORS.SET_PATH': {
      return action.data !== null ? { ...state, path: action.data } : state
    }

    case 'PREDICTORS.SET_SAMPLING_INTERVAL': {
      return { ...state, sampling_interval: action.data }
    }

    case 'PREDICTORS.SET_CODES': {
      return { ...state, codes: action.data }
    }

    default: {
      return state
    }
  }
}
