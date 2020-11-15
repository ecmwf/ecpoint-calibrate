import { connect } from 'react-redux'

import Preloader from './component'

import { setPath, getMetadata } from './actions'
import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  path: state.preloader.path,
  loading: state.preloader.loading,
})

const mapDispatchToProps = dispatch => ({
  onPathChange: path => dispatch(setPath(path)),
  completeSection: (workflow, page) => dispatch(completeSection('C', 1, 'preloader')),
  onGetMetadata: path => dispatch(getMetadata(path)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Preloader)
