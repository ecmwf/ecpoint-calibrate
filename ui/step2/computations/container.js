import { connect } from 'react-redux'

import Computations from './component'

import {
  addComputation,
  updateComputationName,
  updateComputationField,
  updateComputationInputs,
  removeComputation,
  setScaleOp,
  setScaleValue,
  setComputationReference
} from './actions'

const mapStateToProps = state => ({
  database: state.database,
  fields: state.computations.fields
})

const mapDispatchToProps = dispatch => ({
  onComputationNameChange: (index, name) =>
    dispatch(updateComputationName(index, name)),

  onComputationFieldChange: (index, field) =>
    dispatch(updateComputationField(index, field)),

  onComputationInputsChange: (index, inputs) =>
    dispatch(updateComputationInputs(index, inputs)),

  addEmptyComputation: () => dispatch(addComputation('', '', [])),

  onComputationRemove: index => dispatch(removeComputation(index)),

  setScaleOp: (index, op) => dispatch(setScaleOp(index, op)),

  setScaleValue: (index, value) => dispatch(setScaleValue(index, value)),

  setComputationReference: index => dispatch(setComputationReference(index))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Computations)
