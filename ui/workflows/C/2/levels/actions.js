import { arrayMove } from 'react-sortable-hoc'

export const setFields = fields => ({
  type: 'PRELOADER.SET_FIELDS',
  data: fields,
})

export const onFieldsSortEnd = (fields, oldIndex, newIndex) => async dispatch => {
  await dispatch(setFields(arrayMove(fields, oldIndex, newIndex)))
  await dispatch({
    type: 'POSTPROCESSING.SET_THRESHOLD_SPLITS',
    grid: [],
  })

  await dispatch({
    type: 'POSTPROCESSING.SET_WT_MATRIX',
    grid: [],
  })
}
