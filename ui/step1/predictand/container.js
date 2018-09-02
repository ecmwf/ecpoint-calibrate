import { connect } from 'react-redux'

import Predictand from './component'

import { setPath, updatePageCompletion } from './actions'

const mapStateToProps = state => ({
  predictand: state.predictand,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  updatePageCompletion: (page, isComplete) =>
    dispatch(updatePageCompletion(page, isComplete)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Predictand)
