import client from '~/utils/client'
import { errorHandler } from '~/utils/toast'

export const setPath = path => async dispatch => {
  if (path === null) {
    return
  }

  await dispatch({ type: 'PREDICTORS.SET_PATH', data: path })
  await client
    .post('/predictors', { path })
    .then(response => dispatch({ type: 'PREDICTORS.SET_CODES', data: response.data }))
    .catch(errorHandler)
}

export const setSamplingInterval = value => ({
  type: 'PREDICTORS.SET_SAMPLING_INTERVAL',
  data: value,
})
