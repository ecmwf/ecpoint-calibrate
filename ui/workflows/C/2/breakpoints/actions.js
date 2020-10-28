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
      console.error(e)
      console.error(`Error response: ${e.response}`)
      toast.error(`${e.response.status} ${e.response.statusText}`)
    })

  await client
    .post('/postprocessing/create-decision-tree', { labels, matrix })
    .then(response =>
      dispatch({ type: 'POSTPROCESSING.SET_TREE', data: response.data })
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

export const setLoading = value => ({
  type: 'POSTPROCESSING.SET_LOADING',
  data: value,
})
