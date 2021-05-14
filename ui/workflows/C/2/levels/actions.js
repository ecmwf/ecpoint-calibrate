import { arrayMove } from 'react-sortable-hoc'
import client from '~/utils/client'
import { errorHandler } from '~/utils/toast'

export const setFields = fields => ({
  type: 'POSTPROCESSING.SET_FIELDS',
  data: fields,
})

export const setExcludedPredictors = items => ({
  type: 'POSTPROCESSING.SET_EXCLUDED_PREDICTORS',
  data: items,
})

export const onFieldsSortEnd = (
  fields,
  thrGridIn,
  thrGridOut,
  oldIndex,
  newIndex,
  fieldRanges
) => async dispatch => {
  await dispatch(setFields(arrayMove(fields, oldIndex, newIndex)))

  const sortGrid = grid =>
    oldIndex < newIndex
      ? grid.map(row =>
          arrayMove(
            arrayMove(row, oldIndex * 2 + 1, newIndex * 2 + 2),
            oldIndex * 2 + 1,
            newIndex * 2 + 2
          )
        )
      : grid.map(row =>
          arrayMove(
            arrayMove(row, oldIndex * 2 + 1, newIndex * 2 + 1),
            oldIndex * 2 + 2,
            newIndex * 2 + 2
          )
        )

  const newThrGridIn = sortGrid(thrGridIn)
  await dispatch({
    type: 'POSTPROCESSING.SET_THRESHOLD_SPLITS',
    grid: newThrGridIn,
  })

  const labels = newThrGridIn[0].slice(1).map(cell => cell.value)
  const records = newThrGridIn
    .slice(1)
    .map(row => _.flatMap(row.slice(1), cell => cell.value))

  const minIndex = oldIndex < newIndex ? oldIndex : newIndex

  client
    .post('/postprocessing/create-wt-matrix', { labels, records, fieldRanges })
    .then(response => {
      const sortedThrGridOut = sortGrid(thrGridOut)
      const fullThrGridOut = response.data.matrix

      dispatch({
        type: 'POSTPROCESSING.SET_WT_MATRIX',
        grid: sortedThrGridOut.map((row, idx) => {
          const left = row.slice(0, minIndex * 2 + 1)
          const right = fullThrGridOut[idx].slice(minIndex * 2)
          return left.concat(right)
        }),
      })
    })
    .catch(errorHandler)
}
