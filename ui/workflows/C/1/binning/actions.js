import _ from 'lodash'

export const setBins = csv => ({
  type: 'BINNING.SET_BINS',
  data: _.split(csv, ',').map(bin => _.trim(bin)),
})
