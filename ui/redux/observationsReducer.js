const defaultState = {
  path: null,
  units: '',
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'OBSERVATIONS.SET_PATH': {
      return action.data !== null ? { ...state, path: action.data } : state
    }

    case 'OBSERVATIONS.SET_UNITS': {
      return { ...state, units: action.value }
    }

    default: {
      return state
    }
  }
}
