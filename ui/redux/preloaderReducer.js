const defaultState = {
  path: null,
  fields: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PRELOADER.SET_PATH': {
      return { ...state, path: action.data }
    }

    case 'PRELOADER.SET_FIELDS': {
      return { ...state, fields: action.data }
    }

    default: {
      return state
    }
  }
}
