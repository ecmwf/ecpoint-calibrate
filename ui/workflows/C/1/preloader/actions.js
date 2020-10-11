import client from '~/utils/client'

export const setPath = path => async dispatch => {
  if (path === null) {
    return
  }

  await dispatch({ type: 'PRELOADER.SET_PATH', data: path })
  await dispatch({ type: 'PRELOADER.SET_LOADING', data: true })

  client.post(
    { url: '/get-fields-from-ascii-table', body: { path: path }, json: true },
    (err, httpResponse, { fields, minValue, maxValue, count, error, bins }) => {
      dispatch({ type: 'POSTPROCESSING.SET_FIELDS', data: fields })
      dispatch({
        type: 'BINNING.SET_POINT_DATA_META_FIELDS',
        minValue,
        maxValue,
        count,
        error,
        bins,
      })
      dispatch({ type: 'PRELOADER.SET_LOADING', data: false })
    }
  )
}
