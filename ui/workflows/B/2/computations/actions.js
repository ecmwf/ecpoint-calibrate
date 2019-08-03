import client from '~/utils/client'

export const addComputation = data => ({
  type: 'COMPUTATIONS.ADD',
  data,
})

export const updateComputationShortName = (index, shortname) => ({
  type: 'COMPUTATIONS.UPDATE_SHORT_NAME',
  index,
  shortname,
})

export const updateComputationFullName = (index, fullname) => ({
  type: 'COMPUTATIONS.UPDATE_FULL_NAME',
  index,
  fullname,
})

export const updateComputationField = (index, field) => ({
  type: 'COMPUTATIONS.UPDATE_FIELD',
  index,
  field,
})

export const updateComputationInputs = (index, inputs) => ({
  type: 'COMPUTATIONS.UPDATE_INPUTS',
  index,
  inputs,
})

export const fetchAndUpdateInputUnits = (index, input) => async dispatch => {
  client.post(
    { url: '/get-predictor-units', body: { path: input.path }, json: true },
    (err, httpResponse, body) => {
      if (!!err) {
        console.error(err)
      } else {
        dispatch({
          type: 'COMPUTATIONS.SET_INPUT_UNITS',
          code: input.code,
          units: body.units,
          index,
        })
      }
    }
  )
}

export const removeComputation = index => ({
  type: 'COMPUTATIONS.REMOVE',
  index,
})

export const setScaleOp = (index, op) => ({
  type: 'COMPUTATIONS.SET_SCALE_OP',
  index,
  op,
})

export const setScaleValue = (index, value) => ({
  type: 'COMPUTATIONS.SET_SCALE_VALUE',
  index,
  value,
})

export const appendLog = log => ({
  type: 'COMPUTATIONS.APPEND_LOG',
  log,
})

export const toggleComputationPostProcess = index => ({
  type: 'COMPUTATIONS.TOGGLE_POST_PROCESS',
  index,
})
