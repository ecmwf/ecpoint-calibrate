import { connect } from 'react-redux'

import Levels from './component'

import { setFields, onFieldsSortEnd } from './actions'

const mapStateToProps = state => ({
  fields: state.preloader.fields,
})

const mapDispatchToProps = dispatch => ({
  setFields: fields => dispatch(setFields(fields)),

  onFieldsSortEnd: (fields, oldIndex, newIndex) =>
    dispatch(onFieldsSortEnd(fields, oldIndex, newIndex)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Levels)
