import client from '~/utils/client'
import toast from '~/utils/toast'

export const setBreakpoints = (labels, matrix) => async dispatch => {
  await client
    .post('/postprocessing/get-wt-codes', { labels, matrix })
    .then(response =>
      dispatch({
        type: 'POSTPROCESSING.SET_WT_MATRIX',
        grid: matrix.map((row, idx) => [`${response.data.codes[idx]}`].concat(row)),
      })
    )
    .catch(e => {
      if (e.response !== undefined) {
        console.error(e.response.data)
        toast.error(e.response.data)
      } else {
        toast.error('Empty response from server')
      }
    })

  await client
    .post('/postprocessing/create-decision-tree', { labels, matrix })
    .then(response =>
      dispatch({ type: 'POSTPROCESSING.SET_TREE', data: response.data })
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

export const setLoading = value => ({
  type: 'POSTPROCESSING.SET_LOADING',
  data: value,
})
