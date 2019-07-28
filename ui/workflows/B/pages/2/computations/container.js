import { connect } from 'react-redux'

import Computations from './component'

import {
  addComputation,
  updateComputationShortName,
  updateComputationFullName,
  updateComputationField,
  updateComputationInputs,
  removeComputation,
  setScaleOp,
  setScaleValue,
  toggleComputationPostProcess,
} from './actions'

import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  predictors: state.predictors,
  fields: state.computations.fields,
  predictand: state.predictand,
})

const mapDispatchToProps = dispatch => ({
  onComputationShortNameChange: (index, name) =>
    dispatch(updateComputationShortName(index, name)),

  onComputationFullNameChange: (index, name) =>
    dispatch(updateComputationFullName(index, name)),

  onComputationFieldChange: (index, field) =>
    dispatch(updateComputationField(index, field)),

  onComputationInputsChange: (index, inputs) =>
    dispatch(updateComputationInputs(index, inputs)),

  addComputation: data => dispatch(addComputation(data)),

  onComputationRemove: index => dispatch(removeComputation(index)),

  setScaleOp: (index, op) => dispatch(setScaleOp(index, op)),

  setScaleValue: (index, value) => dispatch(setScaleValue(index, value)),

  toggleComputationPostProcess: index => dispatch(toggleComputationPostProcess(index)),

  completeSection: (workflow, page) =>
    dispatch(completeSection('B', 2, 'computations')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Computations)
