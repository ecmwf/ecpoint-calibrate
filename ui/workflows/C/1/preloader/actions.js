import client from '~/utils/client'
import toast from '~/utils/toast'

export const setPath = path => async dispatch => {
  if (path === null) {
    return
  }

  await dispatch({ type: 'PRELOADER.SET_PATH', data: path })
  await dispatch({ type: 'PRELOADER.SET_LOADING', data: true })

  client
    .post('/postprocessing/pdt-tools/statistics', { path })
    .then(response => {
      response.data.fields.map(field =>
        dispatch(setFieldPeriod(field, ['-inf', 'inf']))
      )

      dispatch({ type: 'POSTPROCESSING.SET_FIELDS', data: response.data.fields })
      dispatch({
        type: 'BINNING.SET_POINT_DATA_META_FIELDS',
        ...response.data,
      })
    })
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
    .then(() => dispatch({ type: 'PRELOADER.SET_LOADING', data: false }))
}

export const setFieldPeriod = (field, range) => ({
  type: 'POSTPROCESSING.SET_FIELD_RANGE',
  data: { field, range },
})
