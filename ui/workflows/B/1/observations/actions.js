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
        const error = `(${
          e.response.status
        }) ${e.response.config.method.toUpperCase()} ${e.response.config.url}: ${
          e.response.data
        }`

        console.error(error)
        toast.error(error)
      } else {
        toast.error('Empty response from server')
      }
    })
}
