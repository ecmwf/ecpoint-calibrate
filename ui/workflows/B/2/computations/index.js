import _ from 'lodash'

export { default } from './container'

export const patterns = {
  mulScale: /^(\d+\.?\d*|\.\d+)$/,
  addScale: /^(-?\d+\.?\d*|\.\d+)$/,
}

export const isNotEmpty = state =>
  state.length > 0 &&
  _.every(
    state,
    field =>
      field.shortname &&
      field.fullname &&
      field.field &&
      (field.field !== 'LOCAL_SOLAR_TIME' ? field.inputs.length > 0 : true) &&
      field.mulScale &&
      field.addScale &&
      field.units
  )

export const isValid = state =>
  isNotEmpty(state) &&
  _.every(
    state,
    field =>
      patterns.mulScale.test(field.mulScale) && patterns.addScale.test(field.addScale)
  ) &&
  _.some(state, field => field.isPostProcessed === true)
