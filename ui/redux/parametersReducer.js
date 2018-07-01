import { Set } from 'immutable'

const defaultState = {
  date_start: '',
  date_end: '',
  acc: '',
  limSU: '',
  range: '',
  outPath: '',
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PARAMETERS.SET_DATE_START_FIELD': {
      return { ...state, date_start: action.value }
    }

    case 'PARAMETERS.SET_DATE_END_FIELD': {
      return { ...state, date_end: action.value }
    }

    case 'PARAMETERS.SET_ACC_FIELD': {
      return { ...state, acc: action.value }
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

    default: {
      return state
    }
  }
}
