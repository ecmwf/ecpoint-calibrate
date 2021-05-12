import { connect } from 'react-redux'

import Levels from './component'

import { onFieldsSortEnd, setFields } from './actions'
import { setBreakpoints } from '../breakpoints/actions'

const mapStateToProps = state => ({
  fields: state.postprocessing.fields,
  fieldRanges: state.postprocessing.fieldRanges,
  thrGridIn: state.postprocessing.thrGridIn,
  thrGridOut: state.postprocessing.thrGridOut,
  labels: state.postprocessing.thrGridIn[0].slice(1).map(cell => cell.value),
})

const mapDispatchToProps = dispatch => ({
  onFieldsSortEnd: (fields, thrGridIn, thrGridOut, oldIndex, newIndex, fieldRanges) =>
    dispatch(
      onFieldsSortEnd(fields, thrGridIn, thrGridOut, oldIndex, newIndex, fieldRanges)
    ),

  setFields: fields => dispatch(setFields(fields)),

  setBreakpoints: (labels, matrix, fieldRanges) =>
    dispatch(setBreakpoints(labels, matrix, fieldRanges)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Levels)
