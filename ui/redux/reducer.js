import { combineReducers } from 'redux'

import predictantReducer from './predictantReducer'
import parametersReducer from './parametersReducer'
import pageReducer from './pageReducer'
import logsReducer from './logsReducer'
import computationsReducer from './computationsReducer'

const reducer = combineReducers({
  predictant: predictantReducer,
  parameters: parametersReducer,
  computations: computationsReducer,
  page: pageReducer,
  logs: logsReducer
})

export default reducer
