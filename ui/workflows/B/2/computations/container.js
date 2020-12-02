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
  setMulScaleValue,
  setAddScaleValue,
  toggleComputationPostProcess,
  fetchAndUpdateInputUnits,
} from './actions'

import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  predictors: state.predictors,
  fields: state.computations.fields,
  predictand: state.predictand,
  observations: state.observations,
})

const mapDispatchToProps = dispatch => ({
  onComputationShortNameChange: (index, name) =>
    dispatch(updateComputationShortName(index, name)),

  onComputationFullNameChange: (index, name) =>
    dispatch(updateComputationFullName(index, name)),

  onComputationFieldChange: (index, field) =>
    dispatch(updateComputationField(index, field)),

  onComputationInputsChange: (index, inputs, overrides) => {
    dispatch(updateComputationInputs(index, inputs))

    inputs
      .filter(input => !input.units)
      .map(input => dispatch(fetchAndUpdateInputUnits(index, input, overrides)))
  },

  fetchAndUpdateInputUnits: (index, input, overrides) =>
    dispatch(fetchAndUpdateInputUnits(index, input, overrides)),

  updateUnits: (index, value) =>
    dispatch({ type: 'COMPUTATIONS.SET_UNITS', index, value }),

  addComputation: data => dispatch(addComputation(data)),

  onComputationRemove: index => dispatch(removeComputation(index)),

  setScaleOp: (index, op) => dispatch(setScaleOp(index, op)),

  setMulScaleValue: (index, value) => dispatch(setMulScaleValue(index, value)),

  setAddScaleValue: (index, value) => dispatch(setAddScaleValue(index, value)),

  toggleComputationPostProcess: index => dispatch(toggleComputationPostProcess(index)),

  completeSection: (workflow, page) =>
    dispatch(completeSection('B', 2, 'computations')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Computations)
