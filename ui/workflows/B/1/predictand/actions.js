import client from '~/utils/client'

export const setType = type => ({
  type: 'PREDICTAND.SET_TYPE',
  data: type,
})

export const setPath = path => async dispatch => {
  const path_ = path && path.length !== 0 ? path.pop() : null
  if (path_ !== null) {
    await dispatch({ type: 'PREDICTAND.SET_PATH', data: path_ })

    client.post(
      { url: '/get-predictor-units', body: { path: path_ }, json: true },
      (err, httpResponse, body) => {
        if (!!err) {
          console.error(err)
        } else {
          dispatch({ type: 'PREDICTAND.SET_UNITS', data: body.units })
        }
      }
    )
  }
}

export const set_minValueAcc = value => ({
  type: 'PREDICTAND.SET_ACCUMULATED_MIN_VALUE',
  data: value,
})

export const setAccumulation = value => ({
  type: 'PREDICTAND.SET_ACCUMULATION',
  value,
})
