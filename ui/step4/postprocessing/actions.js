import { arrayMove } from 'react-sortable-hoc'

export const setThresholdSplits = grid => ({
  type: 'POSTPROCESSING.SET_THRESHOLD_SPLITS',
  grid,
})

export const setFields = fields => ({
  type: 'POSTPROCESSING.SET_FIELDS',
  data: fields,
})

export const onFieldsSortEnd = (fields, oldIndex, newIndex) => async dispatch => {
  await dispatch({
    type: 'POSTPROCESSING.SET_FIELDS',
    data: arrayMove(fields, oldIndex, newIndex),
  })

  await dispatch(setThresholdSplits([]))
}
