import client from '~/utils/client'
import { errorHandler } from '~/utils/toast'

export const setUnits = units => ({
  type: 'OBSERVATIONS.SET_UNITS',
  value: units,
})

export const setPath = path => async dispatch => {
  if (path === null) {
    return
  }

  await dispatch({
    type: 'OBSERVATIONS.SET_PATH',
    data: path,
  })

  await client
    .post('/loaders/observations/metadata', { path })
    .then(response => dispatch(setUnits(response.data.units || '')))
    .catch(errorHandler)
}
