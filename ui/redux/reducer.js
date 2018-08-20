import { combineReducers } from 'redux'

import databaseReducer from './databaseReducer'
import parametersReducer from './parametersReducer'
import pageReducer from './pageReducer'
import computationsReducer from './computationsReducer'
import postprocessingReducer from './postprocessingReducer'

const reducer = combineReducers({
  database: databaseReducer,
  parameters: parametersReducer,
  computations: computationsReducer,
  postprocessing: postprocessingReducer,
  page: pageReducer,
})

export default reducer
