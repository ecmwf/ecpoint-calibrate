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

export const addComputation = (name, field, inputs) => ({
  type: 'COMPUTATIONS.ADD',
  name,
  field,
  inputs,
})

export const updateComputationName = (index, name) => ({
  type: 'COMPUTATIONS.UPDATE_NAME',
  index,
  name,
})

export const updateComputationField = (index, field) => ({
  type: 'COMPUTATIONS.UPDATE_FIELD',
  index,
  field,
})

export const updateComputationInputs = (index, inputs) => ({
  type: 'COMPUTATIONS.UPDATE_INPUTS',
  index,
  inputs,
})

export const removeComputation = index => ({
  type: 'COMPUTATIONS.REMOVE',
  index,
})

export const setScaleOp = (index, op) => ({
  type: 'COMPUTATIONS.SET_SCALE_OP',
  index,
  op,
})

export const setScaleValue = (index, value) => ({
  type: 'COMPUTATIONS.SET_SCALE_VALUE',
  index,
  value,
})
