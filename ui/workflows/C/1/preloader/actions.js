import client from '~/utils/client'
import toast from '~/utils/toast'

export const setPath = path => async dispatch => {
  if (path === null) {
    return
  }

  await dispatch({ type: 'PRELOADER.SET_PATH', data: path })
  await dispatch({ type: 'PRELOADER.SET_LOADING', data: true })

  client
    .post('/get-fields-from-ascii-table', { path })
    .then(response => {
      dispatch({ type: 'POSTPROCESSING.SET_FIELDS', data: response.data.fields })
      dispatch({
        type: 'BINNING.SET_POINT_DATA_META_FIELDS',
        ...response.data,
      })
    })
    .catch(e => {
      console.error(e)
      if (e.response !== undefined) {
        console.error(`Error response: ${e.response}`)
        toast.error(`${e.response.status} ${e.response.statusText}`)
      } else {
        toast.error('Empty response from server')
      }
    })
    .then(() => dispatch({ type: 'PRELOADER.SET_LOADING', data: false }))
}

export const getMetadata = path => async dispatch => {
  if (path === null) {
    return
  }

  await dispatch({ type: 'PRELOADER.SET_LOADING', data: true })

  client
    .post('/get-pdt-metadata', { path })
    .then(response => {
      dispatch({ type: 'PRELOADER.SET_METADATA', data: response.data })
    })
    .catch(e => {
      console.error(e)
      if (e.response !== undefined) {
        console.error(`Error response: ${e.response}`)
        toast.error(`${e.response.status} ${e.response.statusText}`)
      } else {
        toast.error('Empty response from server')
      }
    })
    .then(() => dispatch({ type: 'PRELOADER.SET_LOADING', data: false }))
}
