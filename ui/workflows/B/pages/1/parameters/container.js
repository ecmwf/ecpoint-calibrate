import { connect } from 'react-redux'

import Parameters from './component'

import {
  setDateStartField,
  setDateEndField,
  setLimSUField,
  setModelType,
  setDiscretizationField,
  setStartTimeField,
} from './actions'
import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  parameters: state.parameters,
})

const mapDispatchToProps = dispatch => ({
  onParametersDateStartFieldChange: value => dispatch(setDateStartField(value)),

  onParametersDateEndFieldChange: value => dispatch(setDateEndField(value)),

  onParametersLimSUFieldChange: value => dispatch(setLimSUField(value)),

  onModelTypeChange: type => dispatch(setModelType(type)),

  onDiscretizationFieldChange: value => dispatch(setDiscretizationField(value)),

  onStartTimeFieldChange: value => dispatch(setStartTimeField(value)),

  completeSection: () => dispatch(completeSection('B', 1, 'parameters')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Parameters)
