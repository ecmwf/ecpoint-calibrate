import { connect } from 'react-redux'

import Predictand from './component'

import { setPath, updatePageCompletion, setType, set_minValueAcc } from './actions'

const mapStateToProps = state => ({
  predictand: state.predictand,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  onTypeChange: type => dispatch(setType(type)),

  updatePageCompletion: (page, isComplete) =>
    dispatch(updatePageCompletion(page, isComplete)),

  change_minValueAcc: value => dispatch(set_minValueAcc(value)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Predictand)
