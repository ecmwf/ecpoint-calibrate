import { connect } from 'react-redux'

import Observation from './component'

import { setPath, setDiscretizationField, setStartTimeField } from './actions'

import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  observations: state.observations,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  onDiscretizationFieldChange: value => dispatch(setDiscretizationField(value)),

  onStartTimeFieldChange: value => dispatch(setStartTimeField(value)),

  onUnitsChange: value => dispatch({ type: 'OBSERVATIONS.SET_UNITS', value }),

  completeSection: () => dispatch(completeSection('B', 1, 'observations')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Observation)
