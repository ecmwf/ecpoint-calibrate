import { arrayMove } from 'react-sortable-hoc'

import client from '~/utils/client'

export const setThresholdSplits = grid => ({
  type: 'POSTPROCESSING.SET_THRESHOLD_SPLITS',
  grid: grid.map((row, idx) => {
    const [_, ...rest] = row
    return [{ readOnly: true, value: idx === 0 ? '' : idx }].concat(rest)
  }),
})

export const setWeatherTypeMatrix = grid => async dispatch => {
  const labels = grid[0].slice(1).map(cell => cell.value)
  const records = grid.slice(1).map(row => _.flatMap(row.slice(1), cell => cell.value))

  client.post(
    {
      url: '/postprocessing/get-wt-codes',
      body: { records, labels },
      json: true,
    },
    (err, httpResponse, { codes }) => {
      if (!!err) {
        console.error(err)
      } else {
        dispatch({
          type: 'POSTPROCESSING.SET_WT_MATRIX',
          grid: grid.map((row, idx) => {
            const [_, ...rest] = row

            return [
              { readOnly: true, value: idx === 0 ? '' : `WT ${codes[idx - 1]}` },
            ].concat(rest)
          }),
        })
      }
    }
  )
}

export const setFields = fields => ({
  type: 'PRELOADER.SET_FIELDS',
  data: fields,
})

export const onFieldsSortEnd = (fields, oldIndex, newIndex) => async dispatch => {
  await dispatch(setFields(arrayMove(fields, oldIndex, newIndex)))
  await dispatch(setThresholdSplits([]))
}
