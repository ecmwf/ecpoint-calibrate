import _ from 'lodash'

export { default } from './container'

export const isNotEmpty = state =>
  state.length > 0 &&
  _.every(
    state,
    field =>
      field.shortname &&
      field.fullname &&
      field.field &&
      (field.field !== 'LOCAL_SOLAR_TIME' ? field.inputs.length > 0 : true) &&
      field.scale.value &&
      field.units
  )

export const isValid = state =>
  isNotEmpty(state) &&
  _.every(state, field => /^\d+$/.test(field.scale.value)) &&
  _.some(state, field => field.isPostProcessed === true)
