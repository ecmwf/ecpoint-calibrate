const defaultState = {
  running: false,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PROCESSING.SET_RUNNING': {
      return {
        ...state,
        running: action.data,
      }
    }

    default: {
      return state
    }
  }
}
