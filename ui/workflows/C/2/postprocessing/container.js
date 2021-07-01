import { connect } from 'react-redux'

import PostProcessing from './component'

import { onSaveOperationClicked } from './actions'

const mapStateToProps = state => ({
  thrGridIn: state.postprocessing.thrGridIn,
  thrGridOut: state.postprocessing.thrGridOut,
  path: state.preloader.path,
  fields: state.postprocessing.fields,
  yLim: state.postprocessing.yLim,
  numBins: state.postprocessing.numBins,
  tree: state.postprocessing.tree,
  loading: state.postprocessing.loading,
  ...state.binning,
})

const mapDispatchToProps = dispatch => ({
  onYLimChange: value => dispatch({ type: 'POSTPROCESSING.SET_Y_LIM', value }),
  onNumBinsChange: value => dispatch({ type: 'POSTPROCESSING.SET_NUM_BINS', value }),
  onSaveOperationClicked: mode => dispatch(onSaveOperationClicked(mode)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostProcessing)
