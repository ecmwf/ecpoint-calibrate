import { Set } from 'immutable'

const defaultState = {
  acc: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PARAMETERS.SET_ACC_FIELD': {
      if (RegExp(action.pattern)) {
        return { ...state, acc: action.value }
      }
      return state
    }

    default: {
      return state
    }
  }
}
