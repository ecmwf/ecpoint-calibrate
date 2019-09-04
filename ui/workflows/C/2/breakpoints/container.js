import { connect } from 'react-redux'

import Breakpoints from './component'

import { setBreakpoints } from './actions'

const mapStateToProps = state => ({
  breakpoints: state.postprocessing.thrGridOut,
  path: state.preloader.path,
  labels: state.postprocessing.thrGridIn[0].slice(1).map(cell => cell.value),
})

const mapDispatchToProps = dispatch => ({
  setBreakpoints: (labels, matrix) => dispatch(setBreakpoints(labels, matrix)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Breakpoints)
