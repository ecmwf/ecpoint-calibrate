import { connect } from 'react-redux'

import PredictandsComponent from './component'

const mapStateToProps = state => ({
  page: state.page,
})

export default connect(mapStateToProps)(PredictandsComponent)
