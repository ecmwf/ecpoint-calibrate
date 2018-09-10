export { default } from './container'

export const isEmpty = predictand =>
  !(
    predictand.path &&
    predictand.type &&
    (predictand.type === 'ACCUMULATED' ? predictand.accumulation : true) &&
    (predictand.type === 'ACCUMULATED' ? predictand.minValueAcc : true)
  )
