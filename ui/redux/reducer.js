import { combineReducers } from 'redux'

import predictantsReducer from './predictantsReducer'

const reducer = combineReducers({
  predictants: predictantsReducer,
})

export default reducer
