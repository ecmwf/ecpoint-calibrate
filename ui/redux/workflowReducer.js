import _ from 'lodash'

export default (state = null, action) => {
  switch (action.type) {
    case 'WORKFLOW.SET_WORKFLOW': {
      return action.data
    }

    default: {
      return state
    }
  }
}
