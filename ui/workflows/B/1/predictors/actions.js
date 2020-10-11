import client from '~/utils/client'

export const setPath = path => async dispatch => {
  if (path === null) {
    return
  }

  await dispatch({ type: 'PREDICTORS.SET_PATH', data: path })

  client.post(
    { url: '/predictors', body: { path: path }, json: true },
    (err, httpResponse, body) => {
      if (!!err) {
        console.error(err)
      } else {
        dispatch({ type: 'PREDICTORS.SET_CODES', data: body })
      }
    }
  )
}

export const setSamplingInterval = value => ({
  type: 'PREDICTORS.SET_SAMPLING_INTERVAL',
  data: value,
})
