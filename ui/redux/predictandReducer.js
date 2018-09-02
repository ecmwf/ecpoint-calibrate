const defaultState = {
  path: null,
  code: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PREDICTAND.SET_PATH': {
      return action.data !== null
        ? { ...state, path: action.data, code: action.data.replace(/^.*[\\\/]/, '') }
        : state
    }

    default: {
      return state
    }
  }
}
