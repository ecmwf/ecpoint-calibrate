import { connect } from 'react-redux'

import Tree from './component'

import { setBreakpoints } from '../breakpoints/actions'

const mapStateToProps = state => ({
  breakpoints: state.postprocessing.thrGridOut,
  path: state.preloader.path,
  labels: state.postprocessing.thrGridIn[0].slice(1).map(cell => cell.value),
  fields: state.postprocessing.fields,
  yLim: state.postprocessing.yLim,
  data: state.postprocessing.tree,
  ...state.binning,
})

const mapDispatchToProps = dispatch => ({
  setBreakpoints: (labels, matrix) => dispatch(setBreakpoints(labels, matrix)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tree)
