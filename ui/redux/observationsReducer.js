const defaultState = {
  path: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'OBSERVATIONS.SET_PATH': {
      return action.data !== null ? { ...state, path: action.data } : state
    }

    default: {
      return state
    }
  }
}
