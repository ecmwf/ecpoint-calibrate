import client from '~/utils/client'
import toast from '~/utils/toast'

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
    .catch(e => {
      if (e.response !== undefined) {
        console.error(e.response.data)
        toast.error(e.response.data)
      } else {
        toast.error('Empty response from server')
      }
    })
}
