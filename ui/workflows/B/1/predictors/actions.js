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
      console.error(e)
      if (e.response !== undefined) {
        console.error(`Error response: ${e.response}`)
        toast.error(`${e.response.status} ${e.response.statusText}`)
      } else {
        toast.error('Empty response from server')
      }
    })
}

export const setSamplingInterval = value => ({
  type: 'PREDICTORS.SET_SAMPLING_INTERVAL',
  data: value,
})
