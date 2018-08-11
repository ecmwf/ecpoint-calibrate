import _ from 'lodash'

export { default } from './container'

export const isNotEmpty = state => state.length > 0 && _.every(
  state,
  field => (
    field.shortname &&
    field.fullname &&
    field.field &&
    field.inputs.length > 0 &&
    field.scale.value
  )
)

export const isValid = state => (
  isNotEmpty(state) &&
  _.every(state, field => /^\d+$/.test(field.scale.value)) &&
  _.some(state, field => field.isReference === true) &&
  _.some(state, field => field.isPostProcessed === true)
)
