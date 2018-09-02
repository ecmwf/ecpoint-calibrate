const defaultState = {
  predictandPath: null,
  predictorsPath: null,
  type: 'grib',
  predictorCodes: [],
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'DATABASE.SET_PREDICTANT_TYPE': {
      return { ...state, type: action.data }
    }

    case 'DATABASE.SET_PREDICTANT_PATH': {
      return { ...state, predictandPath: action.data }
    }

    case 'DATABASE.SET_PREDICTORS_PATH': {
      return { ...state, predictorsPath: action.data }
    }

    case 'DATABASE.SET_PREDICTOR_CODES': {
      return { ...state, predictorCodes: action.data }
    }

    default: {
      return state
    }
  }
}
