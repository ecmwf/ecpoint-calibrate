const defaultState = {
  path: null,
  type: 'grib',
  codes: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PREDICTORS.SET_TYPE': {
      return { ...state, type: action.data }
    }

    case 'PREDICTORS.SET_PATH': {
      return { ...state, path: action.data }
    }

    case 'PREDICTORS.SET_CODES': {
      return { ...state, codes: action.data }
    }

    default: {
      return state
    }
  }
}
