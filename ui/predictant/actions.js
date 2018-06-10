export const setPredictantType = type => ({
  type: 'PREDICTANT.SET_TYPE',
  data: type,
})

export const setPredictantPaths = paths => ({
  type: 'PREDICTANT.SET_PATHS',
  data: paths,
})

export const setAccField = (value, pattern) => ({
  type: 'PARAMETERS.SET_ACC_FIELD',
  value,
  pattern,
})
