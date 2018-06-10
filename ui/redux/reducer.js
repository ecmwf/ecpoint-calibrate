import { combineReducers } from 'redux'

import predictantReducer from './predictantReducer'
import parametersReducer from './parametersReducer'

const reducer = combineReducers({
  predictant: predictantReducer,
  parameters: parametersReducer,
})

export default reducer
