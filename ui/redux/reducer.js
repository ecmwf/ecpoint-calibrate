import { combineReducers } from 'redux'

import predictandReducer from './predictandReducer'
import predictorsReducer from './predictorsReducer'
import observationsReducer from './observationsReducer'
import parametersReducer from './parametersReducer'
import pageReducer from './pageReducer'
import computationsReducer from './computationsReducer'
import postprocessingReducer from './postprocessingReducer'
import appReducer from './appReducer'
import preloaderReducer from './preloaderReducer'
import workflowReducer from './workflowReducer'

const reducer = combineReducers({
  predictors: predictorsReducer,
  predictand: predictandReducer,
  observations: observationsReducer,
  parameters: parametersReducer,
  computations: computationsReducer,
  postprocessing: postprocessingReducer,
  app: appReducer,
  preloader: preloaderReducer,
  page: pageReducer,
  workflow: workflowReducer,
})

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined
  }

  return reducer(state, action)
}

export default rootReducer
