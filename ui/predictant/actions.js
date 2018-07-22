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
