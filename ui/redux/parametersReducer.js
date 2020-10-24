const defaultState = {
  limSU: '',
  outPath: '',
  outFormat: 'PARQUET',
  modelType: 'grib',
  model_interval: '',
  step_interval: '',
  startTime: '',
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

    case 'PARAMETERS.SET_OUT_PATH': {
      return { ...state, outPath: action.data }
    }

    case 'PARAMETERS.SET_OUT_FORMAT': {
      return { ...state, outFormat: action.data, outPath: '' }
    }

    case 'PARAMETERS.SET_MODEL_TYPE': {
      return { ...state, modelType: action.data }
    }

    case 'PARAMETERS.SET_MODEL_INTERVAL_FIELD': {
      return { ...state, model_interval: action.value }
    }

    case 'PARAMETERS.SET_STEP_INTERVAL_FIELD': {
      return { ...state, step_interval: action.value }
    }

    case 'PARAMETERS.SET_START_TIME_FIELD': {
      return { ...state, startTime: action.value }
    }

    default: {
      return state
    }
  }
}
