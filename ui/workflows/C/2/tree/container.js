import { connect } from 'react-redux'

import Tree from './component'

import { setBreakpoints } from '../breakpoints/actions'

const mapStateToProps = state => ({
  breakpoints: state.postprocessing.thrGridOut,
  path: state.preloader.path,
  labels: state.postprocessing.thrGridIn[0].slice(1).map(cell => cell.value),
  fields: state.postprocessing.fields,
  fieldRanges: state.postprocessing.fieldRanges,
  yLim: state.postprocessing.yLim,
  data: state.postprocessing.tree,
  cheaper: state.preloader.cheaper,
  ...state.binning,
})

const mapDispatchToProps = dispatch => ({
  setBreakpoints: (labels, matrix, fieldRanges) =>
    dispatch(setBreakpoints(labels, matrix, fieldRanges)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tree)
