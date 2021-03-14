import client from '~/utils/client'
import { errorHandler } from '~/utils/toast'

export const setType = type => ({
  type: 'PREDICTAND.SET_TYPE',
  data: type,
})

export const setPath = path => async dispatch => {
  if (path === null) {
    return
  }

  await dispatch({ type: 'PREDICTAND.SET_PATH', data: path })

  await client
    .post('/get-predictor-metadata', { path })
    .then(response =>
      dispatch({ type: 'PREDICTAND.SET_METADATA', data: response.data })
    )
    .catch(errorHandler)
}

export const set_minValueAcc = value => ({
  type: 'PREDICTAND.SET_ACCUMULATED_MIN_VALUE',
  data: value,
})

export const setAccumulation = value => ({
  type: 'PREDICTAND.SET_ACCUMULATION',
  value,
})
