import { connect } from 'react-redux'

import Levels from './component'

import { onFieldsSortEnd } from './actions'

const mapStateToProps = state => ({
  fields: state.postprocessing.fields,
})

const mapDispatchToProps = dispatch => ({
  onFieldsSortEnd: (fields, oldIndex, newIndex) =>
    dispatch(onFieldsSortEnd(fields, oldIndex, newIndex)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Levels)
