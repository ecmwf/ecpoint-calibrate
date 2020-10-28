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
    .post('/get-predictor-units', { path })
    .then(response =>
      dispatch({ type: 'PREDICTAND.SET_UNITS', data: response.data.units })
    )
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

export const set_minValueAcc = value => ({
  type: 'PREDICTAND.SET_ACCUMULATED_MIN_VALUE',
  data: value,
})

export const setAccumulation = value => ({
  type: 'PREDICTAND.SET_ACCUMULATION',
  value,
})
