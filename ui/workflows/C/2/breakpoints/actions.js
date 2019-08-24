import client from '~/utils/client'

export const setBreakpoints = (labels, matrix) => async dispatch => {
  await client.post(
    {
      url: '/postprocessing/get-wt-codes',
      body: { labels, matrix },
      json: true,
    },
    async (err, httpResponse, { codes }) => {
      if (!!err) {
        console.error(err)
      } else {
        await dispatch({
          type: 'POSTPROCESSING.SET_WT_MATRIX',
          grid: matrix.map((row, idx) => [`${codes[idx]}`].concat(row)),
        })
      }
    }
  )
}
