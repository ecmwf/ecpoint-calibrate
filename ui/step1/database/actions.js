import client from '~/utils/client'

export const setPredictantType = type => ({
  type: 'DATABASE.SET_PREDICTANT_TYPE',
  data: type
})

export const setPredictantPath = path => ({
  type: 'DATABASE.SET_PREDICTANT_PATH',
  data: path.length !== 0 ? path.pop() : null
})

export const setPredictorsPath = path => async (dispatch) => {
  const path_ = path.length !== 0 ? path.pop() : null

  if (path_ !== null) {
    await dispatch({type: 'DATABASE.SET_PREDICTORS_PATH', data: path_})

    console.log(path_)

    client.post(
      { url: '/predictors', body: {path: path_}, json: true },
      (err, httpResponse, body) => dispatch({type: 'DATABASE.SET_PREDICTOR_CODES', data: body})
    )
  }
}
