export const setDateStartField = date => ({
  type: 'PARAMETERS.SET_DATE_START_FIELD',
  value: date.toISOString(),
})

export const setDateEndField = date => ({
  type: 'PARAMETERS.SET_DATE_END_FIELD',
  value: date.toISOString(),
})

export const setLimSUField = value => ({
  type: 'PARAMETERS.SET_LIMSU_FIELD',
  value,
})

export const setModelType = type => ({
  type: 'PARAMETERS.SET_MODEL_TYPE',
  data: type,
})

export const setModelIntervalField = value => ({
  type: 'PARAMETERS.SET_MODEL_INTERVAL_FIELD',
  value,
})

export const setStepIntervalField = value => ({
  type: 'PARAMETERS.SET_STEP_INTERVAL_FIELD',
  value,
})

export const setStartTimeField = value => ({
  type: 'PARAMETERS.SET_START_TIME_FIELD',
  value,
})
