import { combineReducers } from 'redux'

import predictandReducer from './predictandReducer'
import predictorsReducer from './predictorsReducer'
import parametersReducer from './parametersReducer'
import pageReducer from './pageReducer'
import computationsReducer from './computationsReducer'
import postprocessingReducer from './postprocessingReducer'
import appReducer from './appReducer'
import preloaderReducer from './preloaderReducer'

const reducer = combineReducers({
  predictors: predictorsReducer,
  predictand: predictandReducer,
  parameters: parametersReducer,
  computations: computationsReducer,
  postprocessing: postprocessingReducer,
  app: appReducer,
  preloader: preloaderReducer,
  page: pageReducer,
})

export default reducer
