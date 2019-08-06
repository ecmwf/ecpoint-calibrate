import { arrayMove } from 'react-sortable-hoc'

export const setThresholdSplits = grid => ({
  type: 'POSTPROCESSING.SET_THRESHOLD_SPLITS',
  grid: grid.map((row, idx) => {
    const [_, ...rest] = row
    return [{ readOnly: true, value: idx === 0 ? '' : idx }].concat(rest)
  }),
})

export const setWeatherTypeMatrix = grid => ({
  type: 'POSTPROCESSING.SET_WT_MATRIX',
  grid: grid.map((row, idx) => {
    const [_, ...rest] = row
    return [{ readOnly: true, value: idx === 0 ? '' : `WT ${idx}` }].concat(rest)
  }),
})

export const setFields = fields => ({
  type: 'PRELOADER.SET_FIELDS',
  data: fields,
})

export const onFieldsSortEnd = (fields, oldIndex, newIndex) => async dispatch => {
  await dispatch(setFields(arrayMove(fields, oldIndex, newIndex)))
  await dispatch(setThresholdSplits([]))
}
