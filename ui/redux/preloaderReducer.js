const defaultState = {
  path: null,
  loading: false,
  cheaper: false,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PRELOADER.SET_PATH': {
      return { ...state, path: action.data }
    }

    case 'PRELOADER.SET_LOADING': {
      return { ...state, loading: action.data }
    }

    case 'PRELOADER.SET_CHEAPER': {
      return { ...state, cheaper: action.data }
    }

    default: {
      return state
    }
  }
}
