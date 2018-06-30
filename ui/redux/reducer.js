import { combineReducers } from 'redux'

import predictantReducer from './predictantReducer'
import parametersReducer from './parametersReducer'
import pageReducer from './pageReducer'
import computationsReducer from './computationsReducer'

const reducer = combineReducers({
  predictant: predictantReducer,
  parameters: parametersReducer,
  computations: computationsReducer,
  page: pageReducer,
})

export default reducer
