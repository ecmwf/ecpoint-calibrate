import { connect } from 'react-redux'

import Breakpoints from './component'

import { setBreakpoints, setLoading } from './actions'

const mapStateToProps = state => ({
  breakpoints: state.postprocessing.thrGridOut,
  path: state.preloader.path,
  labels: state.postprocessing.thrGridIn[0].slice(1).map(cell => cell.value),
  fieldRanges: state.postprocessing.fieldRanges,
  cheaper: state.preloader.cheaper,
  error: state.binning.error,
})

const mapDispatchToProps = dispatch => ({
  setLoading: value => dispatch(setLoading(value)),
  setBreakpoints: (labels, matrix, fieldRanges) =>
    dispatch(setBreakpoints(labels, matrix, fieldRanges)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Breakpoints)
