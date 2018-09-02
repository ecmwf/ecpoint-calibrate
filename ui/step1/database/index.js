export { default } from './container'

export const isEmpty = state =>
  state.predictandPath === null || state.predictorsPath === null
// state.predictorCodes.length === 0
