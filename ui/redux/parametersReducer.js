import { Set } from 'immutable'

const defaultState = {
  acc: null,
  limSU: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
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

    default: {
      return state
    }
  }
}
