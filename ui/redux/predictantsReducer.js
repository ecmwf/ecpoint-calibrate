const defaultState = {
  paths: [],
  type: 'grib',
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PREDICTANT.SET_TYPE': {
      return { ...state, type: action.data }
    }

    case 'PREDICTANT.SET_PATHS': {
      return { ...state, paths: action.data }
    }

    default: {
      return state
    }
  }
}
