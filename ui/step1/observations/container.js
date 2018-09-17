import { connect } from 'react-redux'

import Observation from './component'

import { setPath, updatePageCompletion } from './actions'

const mapStateToProps = state => ({
  observations: state.observations,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  updatePageCompletion: (page, isComplete) =>
    dispatch(updatePageCompletion(page, isComplete)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Observation)
