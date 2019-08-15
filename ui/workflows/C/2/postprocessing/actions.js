import { arrayMove } from 'react-sortable-hoc'

import client from '~/utils/client'

export const setThresholdSplits = grid => ({
  type: 'POSTPROCESSING.SET_THRESHOLD_SPLITS',
  grid: grid.map((row, idx) => {
    const [_, ...rest] = row
    return [{ readOnly: true, value: idx === 0 ? '' : idx }].concat(rest)
  }),
})

export const setWeatherTypeMatrix = (labels, matrix) => async dispatch => {
  client.post(
    {
      url: '/postprocessing/get-wt-codes',
      body: { labels, matrix },
      json: true,
    },
    (err, httpResponse, { codes }) => {
      if (!!err) {
        console.error(err)
      } else {
        dispatch({
          type: 'POSTPROCESSING.SET_WT_MATRIX',
          grid: matrix.map((row, idx) => [`${codes[idx]}`].concat(row)),
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
