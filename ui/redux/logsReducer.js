const defaultState = []

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'COMPUTATIONS.APPEND_LOG': {
      const chunk = action.log.split('[END]').filter(e => e !== '')
      return [...state, ...chunk]
    }

    default: {
      return state
    }
  }
}
