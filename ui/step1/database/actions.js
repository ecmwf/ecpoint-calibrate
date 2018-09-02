import client from '~/utils/client'

export const setPredictandType = type => ({
  type: 'DATABASE.SET_PREDICTANT_TYPE',
  data: type,
})

export const setPredictandPath = path => ({
  type: 'DATABASE.SET_PREDICTANT_PATH',
  data: path.length !== 0 ? path.pop() : null,
})

export const setPredictorsPath = path => async dispatch => {
  const path_ = path.length !== 0 ? path.pop() : null

  if (path_ !== null) {
    await dispatch({ type: 'DATABASE.SET_PREDICTORS_PATH', data: path_ })

    client.post(
      { url: '/predictors', body: { path: path_ }, json: true },
      (err, httpResponse, body) =>
        dispatch({ type: 'DATABASE.SET_PREDICTOR_CODES', data: body })
    )
  }
}

export const updatePageCompletion = (page, isComplete) => ({
  type: 'PAGE.UPDATE_PAGE_COMPLETION',
  page,
  section: 'database',
  isComplete,
})
