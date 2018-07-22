export const setPredictantType = type => ({
  type: 'DATABASE.SET_PREDICTANT_TYPE',
  data: type
})

export const setPredictantPath = path => ({
  type: 'DATABASE.SET_PREDICTANT_PATH',
  data: path
})

export const setPredictorsPath = path => ({
  type: 'DATABASE.SET_PREDICTORS_PATH',
  data: path
})
