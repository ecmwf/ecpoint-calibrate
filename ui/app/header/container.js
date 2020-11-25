import { connect } from 'react-redux'

import Header from './component'
import { onSaveOperationClicked } from './actions'

const mapStateToProps = state => ({
  workflow: state.workflow,
  page: state.page,
})

const mapDispatchToProps = dispatch => ({
  onSaveOperationClicked: mode => dispatch(onSaveOperationClicked(mode)),
  resetApp: () => dispatch({ type: 'RESET_APP' }),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
