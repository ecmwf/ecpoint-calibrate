import { connect } from 'react-redux'

import Processing from './component'

const mapStateToProps = state => ({
  database: state.database,
  parameters: state.parameters,
  computations: state.computations,
})

export default connect(mapStateToProps)(Processing)
