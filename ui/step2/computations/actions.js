export const addComputation = () => ({
  type: 'COMPUTATIONS.ADD',
})

export const updateComputationShortName = (index, shortname) => ({
  type: 'COMPUTATIONS.UPDATE_SHORT_NAME',
  index,
  shortname,
})

export const updateComputationFullName = (index, fullname) => ({
  type: 'COMPUTATIONS.UPDATE_FULL_NAME',
  index,
  fullname,
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

export const toggleComputationPostProcess = index => ({
  type: 'COMPUTATIONS.TOGGLE_POST_PROCESS',
  index,
})

export const updatePageCompletion = (page, isComplete) => ({
  type: 'PAGE.UPDATE_PAGE_COMPLETION',
  page,
  section: 'fields',
  isComplete,
})
