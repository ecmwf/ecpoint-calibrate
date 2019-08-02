export const setDateStartField = moment => ({
  type: 'PARAMETERS.SET_DATE_START_FIELD',
  value: moment.format('YYYYMMDD'),
})

export const setDateEndField = moment => ({
  type: 'PARAMETERS.SET_DATE_END_FIELD',
  value: moment.format('YYYYMMDD'),
})

export const setLimSUField = value => ({
  type: 'PARAMETERS.SET_LIMSU_FIELD',
  value,
})

export const setModelType = type => ({
  type: 'PARAMETERS.SET_MODEL_TYPE',
  data: type,
})

export const setIntervalField = value => ({
  type: 'PARAMETERS.SET_INTERVAL_FIELD',
  value,
})

export const setStartTimeField = value => ({
  type: 'PARAMETERS.SET_START_TIME_FIELD',
  value,
})
