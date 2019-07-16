import _ from 'lodash'

const defaultState = {
  0: {
    isActive: true,
    isComplete: {
      predictand: false,
      predictors: false,
      parameters: false,
      observations: false,
      output: false,
    },
  },
  1: { isActive: false, isComplete: { fields: false } },
  2: { isActive: false, isComplete: { results: false } },
  3: { isActive: false, isComplete: { decisionTree: false } },
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PAGE.SET_PAGE': {
      return {
        ..._.mapValues(state, o => ({ ...o, isActive: false })),
        [action.page]: { ...state[action.page], isActive: true },
      }
    }

    case 'PAGE.UPDATE_PAGE_COMPLETION': {
      return {
        ...state,
        [action.page]: {
          ...state[action.page], // isActive
          isComplete: {
            ...state[action.page].isComplete,
            [action.section]: action.isComplete,
          },
        },
      }
    }

    default: {
      return state
    }
  }
}
