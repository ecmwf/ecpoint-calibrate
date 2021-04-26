import { connect } from 'react-redux'

import Levels from './component'

import { onFieldsSortEnd } from './actions'

const mapStateToProps = state => ({
  fields: state.postprocessing.fields,
  thrGridIn: state.postprocessing.thrGridIn,
  thrGridOut: state.postprocessing.thrGridOut,
})

const mapDispatchToProps = dispatch => ({
  onFieldsSortEnd: (fields, thrGridIn, thrGridOut, oldIndex, newIndex) =>
    dispatch(onFieldsSortEnd(fields, thrGridIn, thrGridOut, oldIndex, newIndex)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Levels)
