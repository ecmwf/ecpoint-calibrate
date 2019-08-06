import client from '~/utils/client'

export const setPath = path => async dispatch => {
  const path_ = path && path.length !== 0 ? path.pop() : null

  if (path_ !== null) {
    await dispatch({ type: 'PREDICTORS.SET_PATH', data: path_ })

    client.post(
      { url: '/predictors', body: { path: path_ }, json: true },
      (err, httpResponse, body) => {
        if (!!err) {
          console.error(err)
        } else {
          dispatch({ type: 'PREDICTORS.SET_CODES', data: body })
        }
      }
    )
  }
}

export const setSamplingInterval = value => ({
  type: 'PREDICTORS.SET_SAMPLING_INTERVAL',
  data: value,
})
