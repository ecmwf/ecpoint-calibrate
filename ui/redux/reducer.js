import { combineReducers } from 'redux'

import databaseReducer from './databaseReducer'
import parametersReducer from './parametersReducer'
import pageReducer from './pageReducer'
import computationsReducer from './computationsReducer'

const reducer = combineReducers({
  database: databaseReducer,
  parameters: parametersReducer,
  computations: computationsReducer,
  page: pageReducer
})

export default reducer
