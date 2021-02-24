import client from '~/utils/client'
import toast from '~/utils/toast'

export const setPath = path => async dispatch => {
  if (path === null) {
    return
  }

  await dispatch({ type: 'PREDICTORS.SET_PATH', data: path })
  await client
    .post('/predictors', { path })
    .then(response => dispatch({ type: 'PREDICTORS.SET_CODES', data: response.data }))
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

export const setSamplingInterval = value => ({
  type: 'PREDICTORS.SET_SAMPLING_INTERVAL',
  data: value,
})
