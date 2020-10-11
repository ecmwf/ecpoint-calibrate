import client from '~/utils/client'

export const setType = type => ({
  type: 'PREDICTAND.SET_TYPE',
  data: type,
})

export const setPath = path => async dispatch => {
  if (path === null) {
    return
  }

  await dispatch({ type: 'PREDICTAND.SET_PATH', data: path })

  client.post(
    { url: '/get-predictor-units', body: { path: path }, json: true },
    (err, httpResponse, body) => {
      if (!!err) {
        console.error(err)
      } else {
        dispatch({ type: 'PREDICTAND.SET_UNITS', data: body.units })
      }
    }
  )
}

export const set_minValueAcc = value => ({
  type: 'PREDICTAND.SET_ACCUMULATED_MIN_VALUE',
  data: value,
})

export const setAccumulation = value => ({
  type: 'PREDICTAND.SET_ACCUMULATION',
  value,
})
