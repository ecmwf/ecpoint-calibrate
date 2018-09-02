import client from '~/utils/client'

export const setType = type => ({
  type: 'PREDICTORS.SET_TYPE',
  data: type,
})

export const setPath = path => async dispatch => {
  const path_ = path && path.length !== 0 ? path.pop() : null

  if (path_ !== null) {
    await dispatch({ type: 'PREDICTORS.SET_PATH', data: path_ })

    client.post(
      { url: '/predictors', body: { path: path_ }, json: true },
      (err, httpResponse, body) =>
        dispatch({ type: 'PREDICTORS.SET_CODES', data: body })
    )
  }
}

export const updatePageCompletion = (page, isComplete) => ({
  type: 'PAGE.UPDATE_PAGE_COMPLETION',
  page,
  section: 'predictors',
  isComplete,
})
