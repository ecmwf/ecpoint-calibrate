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
import binningReducer from './binningReducer'
import workflowReducer from './workflowReducer'
import processingReducer from './processingReducer'

const reducer = combineReducers({
  predictors: predictorsReducer,
  predictand: predictandReducer,
  observations: observationsReducer,
  parameters: parametersReducer,
  computations: computationsReducer,
  postprocessing: postprocessingReducer,
  app: appReducer,
  preloader: preloaderReducer,
  binning: binningReducer,
  page: pageReducer,
  workflow: workflowReducer,
  processing: processingReducer,
})

const rootReducer = (state, action) => {
  if (action.type === 'RESET_APP') {
    state = undefined
  }

  return reducer(state, action)
}

export default rootReducer
