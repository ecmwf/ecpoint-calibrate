import { connect } from 'react-redux'

import PredictantsComponent from './component'

import {
  setPredictantType,
  setPredictantPath,
  setPredictorsPath,
  setDateStartField,
  setDateEndField,
  setAccField,
  setLimSUField,
  setRangeField,
  setOutPath,
  addComputation,
  updateComputationName,
  updateComputationField,
  updateComputationInputs,
  removeComputation,
} from './actions'

const mapStateToProps = state => ({
  predictant: state.predictant,
  parameters: state.parameters,
  computations: state.computations,
  page: state.page.page,
})

const mapDispatchToProps = dispatch => ({
  onPredictantTypeChange: type => dispatch(setPredictantType(type)),

  onPredictantPathChange: path => dispatch(setPredictantPath(path)),

  onPredictorsPathChange: path => dispatch(setPredictorsPath(path)),

  onOutPathChange: path => dispatch(setOutPath(path)),

  onParametersDateStartFieldChange: (value, pattern) =>
    dispatch(setDateStartField(value, pattern)),

  onParametersDateEndFieldChange: (value, pattern) =>
    dispatch(setDateEndField(value, pattern)),

  onParametersAccFieldChange: (value, pattern) =>
    dispatch(setAccField(value, pattern)),

  onParametersLimSUFieldChange: (value, pattern) =>
    dispatch(setLimSUField(value, pattern)),

  onParametersRangeFieldChange: (value, pattern) =>
    dispatch(setRangeField(value, pattern)),

  onComputationNameChange: (key, name) =>
    dispatch(updateComputationName(key, name)),

  onComputationFieldChange: (key, field) =>
    dispatch(updateComputationField(key, field)),

  onComputationInputsChange: (key, inputs) =>
    dispatch(updateComputationInputs(key, inputs)),

  addEmptyComputation: () => dispatch(addComputation('', '', [])),

  onComputationRemove: index => dispatch(removeComputation(index)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PredictantsComponent)
