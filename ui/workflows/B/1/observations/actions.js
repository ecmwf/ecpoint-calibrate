import client from '~/utils/client'
import { errorHandler } from '~/utils/toast'

export const setUnits = units => ({
  type: 'OBSERVATIONS.SET_UNITS',
  value: units,
})

export const setWarning = toggle => ({
  type: 'OBSERVATIONS.SET_WARNING',
  value: toggle,
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
    .then(response => {
      const units = response.data.units || ''
      units === '' && dispatch(setWarning(true))
      dispatch(setUnits(units))
    })
    .catch(errorHandler)
}
