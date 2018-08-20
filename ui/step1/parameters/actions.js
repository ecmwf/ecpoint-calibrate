export const setOutPath = path => ({
  type: 'PARAMETERS.SET_OUT_PATH',
  data: path,
})

export const setAccField = value => ({
  type: 'PARAMETERS.SET_ACC_FIELD',
  value,
})

export const setDateStartField = moment => ({
  type: 'PARAMETERS.SET_DATE_START_FIELD',
  value: moment.format('YYYY-MM-DD'),
})

export const setDateEndField = moment => ({
  type: 'PARAMETERS.SET_DATE_END_FIELD',
  value: moment.format('YYYY-MM-DD'),
})

export const setLimSUField = value => ({
  type: 'PARAMETERS.SET_LIMSU_FIELD',
  value,
})

export const setRangeField = value => ({
  type: 'PARAMETERS.SET_RANGE_FIELD',
  value,
})

export const updatePageCompletion = (page, isComplete) => ({
  type: 'PAGE.UPDATE_PAGE_COMPLETION',
  page,
  section: 'parameters',
  isComplete,
})
