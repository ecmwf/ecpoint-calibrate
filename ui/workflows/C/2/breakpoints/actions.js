import client from '~/utils/client'
import { errorHandler } from '~/utils/toast'

export const setBreakpoints = (labels, matrix, fieldRanges) => async dispatch => {
  await client
    .post('/postprocessing/get-wt-codes', { labels, matrix, fieldRanges })
    .then(response =>
      dispatch({
        type: 'POSTPROCESSING.SET_WT_MATRIX',
        grid: matrix.map((row, idx) => [`${response.data.codes[idx]}`].concat(row)),
      })
    )
    .catch(errorHandler)

  await client
    .post('/postprocessing/create-decision-tree', { labels, matrix, fieldRanges })
    .then(response =>
      dispatch({ type: 'POSTPROCESSING.SET_TREE', data: response.data })
    )
    .catch(errorHandler)
}

export const setLoading = value => ({
  type: 'POSTPROCESSING.SET_LOADING',
  data: value,
})
