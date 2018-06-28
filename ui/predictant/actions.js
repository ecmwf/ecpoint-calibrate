export const setPredictantType = type => ({
  type: 'PREDICTANT.SET_TYPE',
  data: type,
})

export const setPredictantPath = path => ({
  type: 'PREDICTANT.SET_PREDICTANT_PATH',
  data: path,
})

export const setPredictorsPath = path => ({
  type: 'PREDICTANT.SET_PREDICTORS_PATH',
  data: path,
})

export const setOutPath = path => ({
  type: 'PARAMETERS.SET_OUT_PATH',
  data: path,
})

export const setAccField = (value, pattern) => ({
  type: 'PARAMETERS.SET_ACC_FIELD',
  value,
  pattern,
})

export const setDateStartField = (value, pattern) => ({
  type: 'PARAMETERS.SET_DATE_START_FIELD',
  value,
  pattern,
})

export const setDateEndField = (value, pattern) => ({
  type: 'PARAMETERS.SET_DATE_END_FIELD',
  value,
  pattern,
})

export const setLimSUField = (value, pattern) => ({
  type: 'PARAMETERS.SET_LIMSU_FIELD',
  value,
  pattern,
})

export const setRangeField = (value, pattern) => ({
  type: 'PARAMETERS.SET_RANGE_FIELD',
  value,
  pattern,
})
