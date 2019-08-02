const defaultState = {
  path: null,
  discretization: '',
  startTime: '',
  units: '',
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'OBSERVATIONS.SET_PATH': {
      return action.data !== null ? { ...state, path: action.data } : state
    }

    case 'OBSERVATIONS.SET_DISCRETIZATION_FIELD': {
      return { ...state, discretization: action.value }
    }

    case 'OBSERVATIONS.SET_START_TIME_FIELD': {
      return { ...state, startTime: action.value }
    }

    case 'OBSERVATIONS.SET_UNITS': {
      return { ...state, units: action.value }
    }

    default: {
      return state
    }
  }
}
