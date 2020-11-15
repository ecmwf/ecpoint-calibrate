import { connect } from 'react-redux'

import PDTViewer from './component'

const mapStateToProps = state => ({
  path: state.preloader.path,
  loading: state.preloader.loading,
  metadata: state.preloader.metadata,
})

const mapDispatchToProps = dispatch => ({
  onModalClose: () => dispatch({ type: 'PRELOADER.SET_METADATA', data: null }),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PDTViewer)
