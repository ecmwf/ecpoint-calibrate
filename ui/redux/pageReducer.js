import _ from 'lodash'

const defaultState = {
  0: { isActive: true, isComplete: false },
  1: { isActive: false, isComplete: false },
  2: { isActive: false, isComplete: false }
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PAGE.SET_PAGE': {
      return {
        ..._.mapValues(state, o => ({...o, isActive: false})),
        [action.page]: { ...state[action.page], isActive: true }
      }
    }

    case 'PAGE.UPDATE_PAGE_COMPLETION': {
      return {
        ...state,
        [action.page]: { ...state[action.page], isComplete: action.isComplete }
      }
    }

    default: {
      return state
    }
  }
}
