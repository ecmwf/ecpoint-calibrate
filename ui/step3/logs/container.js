import { connect } from 'react-redux'

import ComputationLogs from './component'

const mapStateToProps = state => ({
  database: state.database,
  parameters: state.parameters,
  computations: state.computations
})

export default connect(
  mapStateToProps
)(ComputationLogs)
