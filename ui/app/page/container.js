import { connect } from 'react-redux'

import PredictandsComponent from './component'

const mapStateToProps = state => ({
  page: state.page,
  workflow: state.workflow,
  processing: state.processing,
})

const mapDispatchToProps = dispatch => ({
  onPageChange: page => {
    dispatch({
      type: 'PAGE.SET_PAGE',
      page,
    })
  },
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PredictandsComponent)
