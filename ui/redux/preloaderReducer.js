const defaultState = {
  path: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PRELOADER.SET_PATH': {
      return { ...state, path: action.data }
    }

    default: {
      return state
    }
  }
}
