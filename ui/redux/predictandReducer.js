const defaultState = {
  path: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PREDICTAND.SET_PATH': {
      return { ...state, path: action.data }
    }

    default: {
      return state
    }
  }
}
