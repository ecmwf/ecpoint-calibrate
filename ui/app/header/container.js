import { connect } from 'react-redux'

import Header from './component'
import { onSaveOperationClicked } from './actions'

const mapStateToProps = state => ({
  workflow: state.workflow,
  page: state.page,
  reduxState: state,
})

const mapDispatchToProps = dispatch => ({
  onSaveOperationClicked: mode => dispatch(onSaveOperationClicked(mode)),
  resetApp: () => dispatch({ type: 'RESET_APP' }),
  loadWorkflow: data => {
    dispatch({ type: 'LOAD_WORKFLOW', data })
    dispatch({
      type: 'PAGE.SET_PAGE',
      page: 1,
    })
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
