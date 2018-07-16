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

export const setAccField = value => ({
  type: 'PARAMETERS.SET_ACC_FIELD',
  value,
})

export const setDateStartField = value => ({
  type: 'PARAMETERS.SET_DATE_START_FIELD',
  value,
})

export const setDateEndField = value => ({
  type: 'PARAMETERS.SET_DATE_END_FIELD',
  value,
})

export const setLimSUField = value => ({
  type: 'PARAMETERS.SET_LIMSU_FIELD',
  value,
})

export const setRangeField = value => ({
  type: 'PARAMETERS.SET_RANGE_FIELD',
  value,
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

export const appendLog = log => ({
  type: 'COMPUTATIONS.APPEND_LOG',
  log,
})
