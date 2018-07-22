export const addComputation = (name, field, inputs) => ({
  type: 'COMPUTATIONS.ADD',
  name,
  field,
  inputs
})

export const updateComputationName = (index, name) => ({
  type: 'COMPUTATIONS.UPDATE_NAME',
  index,
  name
})

export const updateComputationField = (index, field) => ({
  type: 'COMPUTATIONS.UPDATE_FIELD',
  index,
  field
})

export const updateComputationInputs = (index, inputs) => ({
  type: 'COMPUTATIONS.UPDATE_INPUTS',
  index,
  inputs
})

export const removeComputation = index => ({
  type: 'COMPUTATIONS.REMOVE',
  index
})

export const setScaleOp = (index, op) => ({
  type: 'COMPUTATIONS.SET_SCALE_OP',
  index,
  op
})

export const setScaleValue = (index, value) => ({
  type: 'COMPUTATIONS.SET_SCALE_VALUE',
  index,
  value
})

export const appendLog = log => ({
  type: 'COMPUTATIONS.APPEND_LOG',
  log
})
