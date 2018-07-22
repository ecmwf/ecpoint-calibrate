const defaultState = {
  predictantPath: null,
  predictorsPath: null,
  type: 'grib'
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PREDICTANT.SET_TYPE': {
      return { ...state, type: action.data }
    }

    case 'PREDICTANT.SET_PREDICTANT_PATH': {
      return { ...state, predictantPath: action.data.pop() }
    }

    case 'PREDICTANT.SET_PREDICTORS_PATH': {
      return { ...state, predictorsPath: action.data.pop() }
    }

    default: {
      return state
    }
  }
}
