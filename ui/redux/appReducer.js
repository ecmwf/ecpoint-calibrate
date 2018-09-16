const defaultState = {
  scratch: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'APP.SET_SCRATCH_VALUE': {
      return { ...state, scratch: action.data }
    }

    default: {
      return state
    }
  }
}
