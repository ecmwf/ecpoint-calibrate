import { combineReducers } from 'redux'

import predictantReducer from './predictantReducer'
import parametersReducer from './parametersReducer'
import pageReducer from './pageReducer'

const reducer = combineReducers({
  predictant: predictantReducer,
  parameters: parametersReducer,
  page: pageReducer,
})

export default reducer
