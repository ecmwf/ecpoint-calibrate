import { connect } from 'react-redux'

import PostProcessing from './component'

import { setBreakpoints } from '../breakpoints/actions'
import { onSaveOperationClicked } from './actions'

const mapStateToProps = state => ({
  thrGridIn: state.postprocessing.thrGridIn,
  thrGridOut: state.postprocessing.thrGridOut,
  path: state.preloader.path,
  fields: state.postprocessing.fields,
  yLim: state.postprocessing.yLim,
  tree: state.postprocessing.tree,
  loading: state.postprocessing.loading,
  ...state.binning,
})

const mapDispatchToProps = dispatch => ({
  onYLimChange: value => dispatch({ type: 'POSTPROCESSING.SET_Y_LIM', value }),

  setBreakpoints: (labels, matrix) => dispatch(setBreakpoints(labels, matrix)),

  onSaveOperationClicked: mode => dispatch(onSaveOperationClicked(mode)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PostProcessing)
