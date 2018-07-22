import { connect } from 'react-redux'

import Computations from './component'

import {
  addComputation,
  updateComputationName,
  updateComputationField,
  updateComputationInputs,
  removeComputation,
  setScaleOp,
  setScaleValue
} from './actions'

const mapStateToProps = state => ({
  predictant: state.predictant,
  parameters: state.parameters,
  computations: state.computations,
  page: state.page.page,
  logs: state.logs
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
  setScaleValue: (index, value) => dispatch(setScaleValue(index, value))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Computations)
