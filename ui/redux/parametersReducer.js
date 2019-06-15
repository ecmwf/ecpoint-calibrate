const defaultState = {
  limSU: '',
  range: '',
  outPath: '',
  modelType: 'grib',
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PARAMETERS.SET_DATE_START_FIELD': {
      return { ...state, date_start: action.value }
    }

    case 'PARAMETERS.SET_DATE_END_FIELD': {
      return { ...state, date_end: action.value }
    }

    case 'PARAMETERS.SET_LIMSU_FIELD': {
      return { ...state, limSU: action.value }
    }

    case 'PARAMETERS.SET_RANGE_FIELD': {
      return { ...state, range: action.value }
    }

    case 'PARAMETERS.SET_OUT_PATH': {
      return { ...state, outPath: action.data }
    }

    case 'PARAMETERS.SET_MODEL_TYPE': {
      return { ...state, modelType: action.data }
    }

    default: {
      return state
    }
  }
}
