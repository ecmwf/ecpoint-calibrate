import { connect } from 'react-redux'

import SparseBreakpoints from './component'

import { setBreakpoints as setSparseBreakpoints } from './actions'
import { setBreakpoints } from '../breakpoints/actions'

const mapStateToProps = state => ({
  sparseBreakpoints: state.postprocessing.thrGridIn,
  breakpoints: state.postprocessing.thrGridOut,
  labels: state.postprocessing.thrGridIn[0].slice(1).map(cell => cell.value),
  fields: state.postprocessing.fields,
  fieldRanges: state.postprocessing.fieldRanges,
})

const mapDispatchToProps = dispatch => ({
  setSparseBreakpoints: grid => dispatch(setSparseBreakpoints(grid)),
  setBreakpoints: (labels, matrix, fieldRanges) =>
    dispatch(setBreakpoints(labels, matrix, fieldRanges)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SparseBreakpoints)
