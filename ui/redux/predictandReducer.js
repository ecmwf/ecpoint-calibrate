const defaultState = {
  path: null,
  code: null,
  type: null,
  error: null,
  minValueAcc: '',
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PREDICTAND.SET_PATH': {
      return action.data !== null
        ? { ...state, path: action.data, code: action.data.replace(/^.*[\\\/]/, '') }
        : state
    }

    case 'PREDICTAND.SET_TYPE': {
      return {
        ...state,
        type: action.data,
        error: action.data === 'ACCUMULATED' ? 'FER' : 'FE',
      }
    }

    case 'PREDICTAND.SET_ACCUMULATED_MIN_VALUE': {
      return { ...state, minValueAcc: action.data }
    }

    default: {
      return state
    }
  }
}
