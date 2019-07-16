import { connect } from 'react-redux'

import Observation from './component'

import {
  setPath,
  setDiscretizationField,
  setStartTimeField,
  updatePageCompletion,
} from './actions'

const mapStateToProps = state => ({
  observations: state.observations,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  onDiscretizationFieldChange: value => dispatch(setDiscretizationField(value)),

  onStartTimeFieldChange: value => dispatch(setStartTimeField(value)),

  updatePageCompletion: (page, isComplete) =>
    dispatch(updatePageCompletion(page, isComplete)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Observation)
