import { connect } from 'react-redux'

import Predictors from './component'

import { setPath, updatePageCompletion } from './actions'

const mapStateToProps = state => ({
  predictors: state.predictors,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  updatePageCompletion: (page, isComplete) =>
    dispatch(updatePageCompletion(page, isComplete)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Predictors)
