import { connect } from 'react-redux'

import Summary from './component'

const mapStateToProps = state => ({
  summary: state.binning.summary,
  count: state.binning.count,
})

const mapDispatchToProps = dispatch => ({})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary)
