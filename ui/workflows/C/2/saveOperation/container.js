import { connect } from 'react-redux'

import SaveOperation from './component'
import { onSaveOperationClosed } from './actions'

const mapStateToProps = state => ({
  open: state.postprocessing.saveOperation,
})

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(onSaveOperationClosed()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SaveOperation)
