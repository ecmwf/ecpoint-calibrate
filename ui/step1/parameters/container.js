import { connect } from 'react-redux'

import Parameters from './component'

import {
  setDateStartField,
  setDateEndField,
  setLimSUField,
  setModelType,
  updatePageCompletion,
} from './actions'

const mapStateToProps = state => ({
  parameters: state.parameters,
})

const mapDispatchToProps = dispatch => ({
  onParametersDateStartFieldChange: value => dispatch(setDateStartField(value)),

  onParametersDateEndFieldChange: value => dispatch(setDateEndField(value)),

  onParametersLimSUFieldChange: value => dispatch(setLimSUField(value)),

  onModelTypeChange: type => dispatch(setModelType(type)),

  updatePageCompletion: (page, isComplete) =>
    dispatch(updatePageCompletion(page, isComplete)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Parameters)
