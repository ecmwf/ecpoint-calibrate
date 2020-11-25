import { connect } from 'react-redux'

import SaveOperation from './component'
import { onSaveOperationClosed, setLoading } from './actions'

const mapStateToProps = state => ({
  open: state.postprocessing.saveOperationMode !== null,
  mode: state.postprocessing.saveOperationMode,
  yLim: state.postprocessing.yLim,
  cheaper: state.preloader.cheaper,
  breakpoints: state.postprocessing.thrGridOut,
  path: state.preloader.path,
  labels: state.postprocessing.thrGridIn[0].slice(1).map(cell => cell.value),
  error: state.binning.error,
  bins: state.binning.bins,
})

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(onSaveOperationClosed()),

  setLoading: value => dispatch(setLoading(value)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveOperation)
