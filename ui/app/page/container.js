import { connect } from 'react-redux'

import PredictantsComponent from './component'

const mapStateToProps = state => ({
  page: state.page.page
})

export default connect(
  mapStateToProps
)(PredictantsComponent)
