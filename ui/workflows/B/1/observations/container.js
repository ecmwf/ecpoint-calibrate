import { connect } from 'react-redux'

import Observation from './component'

import { setPath } from './actions'

import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  observations: state.observations,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  onUnitsChange: value => dispatch({ type: 'OBSERVATIONS.SET_UNITS', value }),

  completeSection: () => dispatch(completeSection('B', 1, 'observations')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Observation)
