import { connect } from 'react-redux'

import Binning from './component'

import { setBins } from './actions'
import { completeSection } from '~/commonActions'

const mapStateToProps = state => ({
  fields: state.postprocessing.fields,
  ...state.binning,
})

const mapDispatchToProps = dispatch => ({
  setBins: csv => dispatch(setBins(csv)),
  completeSection: (workflow, page) => dispatch(completeSection('C', 1, 'binning')),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Binning)
