import { connect } from 'react-redux'

import Observation from './component'

import { setPath, setUnits } from './actions'

import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  observations: state.observations,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),

  onUnitsChange: value => dispatch(setUnits(value)),

  completeSection: () => dispatch(completeSection('B', 1, 'observations')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Observation)
