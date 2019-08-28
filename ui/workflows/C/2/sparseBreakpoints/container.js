import { connect } from 'react-redux'

import SparseBreakpoints from './component'

import { setBreakpoints } from './actions'

const mapStateToProps = state => ({
  breakpoints: state.postprocessing.thrGridIn,
  fields: state.postprocessing.fields,
})

const mapDispatchToProps = dispatch => ({
  setBreakpoints: grid => dispatch(setBreakpoints(grid)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SparseBreakpoints)
