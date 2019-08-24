export const setBreakpoints = grid => ({
  type: 'POSTPROCESSING.SET_THRESHOLD_SPLITS',
  grid: grid.map((row, idx) => {
    const [_, ...rest] = row
    return [{ readOnly: true, value: idx === 0 ? '' : idx }].concat(rest)
  }),
})
