import client from '~/utils/client'
import toast from '~/utils/toast'

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

export const set_minValueAcc = value => ({
  type: 'PREDICTAND.SET_ACCUMULATED_MIN_VALUE',
  data: value,
})

export const setAccumulation = value => ({
  type: 'PREDICTAND.SET_ACCUMULATION',
  value,
})
