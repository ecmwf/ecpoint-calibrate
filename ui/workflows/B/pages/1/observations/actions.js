export const setPath = path => ({
  type: 'OBSERVATIONS.SET_PATH',
  data: path && path.length !== 0 ? path.pop() : null,
})

export const setDiscretizationField = value => ({
  type: 'OBSERVATIONS.SET_DISCRETIZATION_FIELD',
  value,
})

export const setStartTimeField = value => ({
  type: 'OBSERVATIONS.SET_START_TIME_FIELD',
  value,
})
