import { connect } from 'react-redux'

import Predictors from './component'

import { setType, setPath, updatePageCompletion } from './actions'

const mapStateToProps = state => ({
  predictors: state.predictors,
})

const mapDispatchToProps = dispatch => ({
  onTypeChange: type => dispatch(setType(type)),

  onPathChange: path => dispatch(setPath(path)),

  updatePageCompletion: (page, isComplete) =>
    dispatch(updatePageCompletion(page, isComplete)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Predictors)
