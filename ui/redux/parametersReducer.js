import { Set } from 'immutable'

const defaultState = {
  date_start: null,
  date_end: null,
  acc: null,
  limSU: null,
  range: null,
  outPath: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PARAMETERS.SET_DATE_START_FIELD': {
      if (RegExp(action.pattern)) {
        return { ...state, date_start: action.value }
      }
      return state
    }

    case 'PARAMETERS.SET_DATE_END_FIELD': {
      if (RegExp(action.pattern)) {
        return { ...state, date_end: action.value }
      }
      return state
    }

    case 'PARAMETERS.SET_ACC_FIELD': {
      if (RegExp(action.pattern)) {
        return { ...state, acc: action.value }
      }
      return state
    }

    case 'PARAMETERS.SET_LIMSU_FIELD': {
      if (RegExp(action.pattern)) {
        return { ...state, limSU: action.value }
      }
      return state
    }

    case 'PARAMETERS.SET_RANGE_FIELD': {
      if (RegExp(action.pattern)) {
        return { ...state, range: action.value }
      }
      return state
    }

    case 'PARAMETERS.SET_OUT_PATH': {
      return { ...state, outPath: action.data }
    }

    default: {
      return state
    }
  }
}
