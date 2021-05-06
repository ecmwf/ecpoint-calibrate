export const isMergeableToPreviousRow = (row, matrix) => {
  if (row === 0) {
    return false
  }

  if (matrix.length === 2) {
    return true
  }

  if (matrix.length === 1) {
    return false
  }

  /* B is being merged to A */
  const [A, B] = [
    _.slice(matrix[row - 1], 1).reverse(),
    _.slice(matrix[row], 1).reverse(),
  ]

  const zipped_columns = _.zip(_.chunk(A, 2), _.chunk(B, 2))

  let index = 0

  while (index !== zipped_columns.length) {
    const [[aHigh, aLow], [bHigh, bLow]] = zipped_columns[index]
    if (aLow !== '-inf' || bLow !== '-inf' || aHigh !== 'inf' || bHigh !== 'inf') {
      break
    }
    index += 1
  }

  const pruned_columns = zipped_columns.slice(index)

  if (
    pruned_columns.length === 1 &&
    pruned_columns.map(row => row.every(cell => cell.length === 1)).every(e => e)
  ) {
    return true
  }

  const [[[aHighFirst, aLowFirst], [bHighFirst, bLowFirst]], ...rest] = pruned_columns

  return aHighFirst === bLowFirst
}

export const mergeToPreviousRow = (row, matrix) => {
  /* B is being merged to A */
  const [A, B] = [[...matrix[row - 1]].reverse(), [...matrix[row]].reverse()]

  const zipped_columns = _.zip(_.chunk(A, 2), _.chunk(B, 2))

  let index = 0

  while (index !== zipped_columns.length) {
    const [[aHigh, aLow], [bHigh, bLow]] = zipped_columns[index]
    if (aLow !== '-inf' || bLow !== '-inf' || aHigh !== 'inf' || bHigh !== 'inf') {
      break
    }
    index += 1
  }

  const unbounded_leaves = _.flatten(_.times(index, _.constant(['-inf', 'inf'])))
  const [
    [[aHighFirst, aLowFirst], [bHighFirst, bLowFirst]],
    ...rest
  ] = zipped_columns.slice(index)

  rest.reverse()

  const newRow = [
    ...rest.flatMap(([[aHigh, aLow], [bHigh, bLow]]) => [aLow, aHigh]),
    ...[aLowFirst, bHighFirst],
    ...unbounded_leaves,
  ]

  return [..._.slice(matrix, 0, row - 1), newRow, ..._.slice(matrix, row + 1)]
}
