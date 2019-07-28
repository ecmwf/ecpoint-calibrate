import _ from 'lodash'

const defaultState = {
  activePageNumber: 1,
  B: {
    1: {
      observations: false,
      output: false,
      parameters: false,
      predictand: false,
      predictors: false,
    },
    2: { computations: false },
    3: { processing: false },
  },
  C: {
    1: { preloader: false, postprocessing: false },
  },
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case 'PAGE.COMPLETE_SECTION': {
      return {
        ...state,
        [action.workflow]: {
          ...state[action.workflow],
          [action.page]: {
            ...state[action.workflow][action.page],
            [action.section]: true,
          },
        },
      }
    }

    case 'PAGE.SET_PAGE': {
      return {
        ...state,
        activePageNumber: action.page,
      }
    }

    default: {
      return state
    }
  }
}
