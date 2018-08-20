import { connect } from 'react-redux'

import Parameters from './component'

import {
  setDateStartField,
  setDateEndField,
  setAccField,
  setLimSUField,
  setRangeField,
  setOutPath,
  updatePageCompletion,
} from './actions'

const mapStateToProps = state => ({
  parameters: state.parameters,
})

const mapDispatchToProps = dispatch => ({
  onOutPathChange: path => dispatch(setOutPath(path)),

  onParametersDateStartFieldChange: value => dispatch(setDateStartField(value)),

  onParametersDateEndFieldChange: value => dispatch(setDateEndField(value)),

  onParametersAccFieldChange: value => dispatch(setAccField(value)),

  onParametersLimSUFieldChange: value => dispatch(setLimSUField(value)),

  onParametersRangeFieldChange: value => dispatch(setRangeField(value)),

  updatePageCompletion: (page, isComplete) =>
    dispatch(updatePageCompletion(page, isComplete)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Parameters)
