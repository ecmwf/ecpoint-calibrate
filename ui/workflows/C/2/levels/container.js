import { connect } from 'react-redux'

import Levels from './component'

import { onFieldsSortEnd } from './actions'

const mapStateToProps = state => ({
  fields: state.postprocessing.fields,
  fieldRanges: state.postprocessing.fieldRanges,
  thrGridIn: state.postprocessing.thrGridIn,
  thrGridOut: state.postprocessing.thrGridOut,
})

const mapDispatchToProps = dispatch => ({
  onFieldsSortEnd: (fields, thrGridIn, thrGridOut, oldIndex, newIndex, fieldRanges) =>
    dispatch(
      onFieldsSortEnd(fields, thrGridIn, thrGridOut, oldIndex, newIndex, fieldRanges)
    ),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Levels)
