import { combineReducers } from 'redux'

import predictantReducer from './predictantReducer'

const reducer = combineReducers({
  predictant: predictantReducer,
})

export default reducer
