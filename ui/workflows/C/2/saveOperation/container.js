import { connect } from 'react-redux'

import SaveOperation from './component'
import { onSaveOperationClosed, setLoading } from './actions'
import { setBreakpoints } from '../breakpoints/actions'

const mapStateToProps = state => ({
  open: state.postprocessing.saveOperationMode !== null,
  mode: state.postprocessing.saveOperationMode,
  yLim: state.postprocessing.yLim,
  numBins: state.postprocessing.numBins,
  cheaper: state.preloader.cheaper,
  breakpoints: state.postprocessing.thrGridOut,
  excludedPredictors: state.postprocessing.excludedPredictors,
  path: state.preloader.path,
  labels: state.postprocessing.thrGridIn[0].slice(1).map(cell => cell.value),
  error: state.binning.error,
  bins: state.binning.bins,
  fieldRanges: state.postprocessing.fieldRanges,
})

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(onSaveOperationClosed()),

  setLoading: value => dispatch(setLoading(value)),

  setBreakpoints: (labels, matrix, fieldRanges) =>
    dispatch(setBreakpoints(labels, matrix, fieldRanges)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveOperation)
