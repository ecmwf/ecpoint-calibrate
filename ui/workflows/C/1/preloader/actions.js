import client from '~/utils/client'

export const setPath = path => async dispatch => {
  const path_ = path && path.length !== 0 ? path.pop() : null

  if (path_ !== null) {
    await dispatch({ type: 'PRELOADER.SET_PATH', data: path_ })

    client.post(
      { url: '/get-fields-from-ascii-table', body: { path: path_ }, json: true },
      (err, httpResponse, body) =>
        dispatch({ type: 'PRELOADER.SET_FIELDS', data: body })
    )
  }
}
