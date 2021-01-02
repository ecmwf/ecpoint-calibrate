import { connect } from 'react-redux'

import Periods from './component'

const mapStateToProps = state => ({
  periods: state.postprocessing.fieldPeriods,
})

const mapDispatchToProps = dispatch => ({
  setPeriod: (field, period) =>
    dispatch({
      type: 'POSTPROCESSING.SET_FIELD_PERIOD',
      data: { field, period },
    }),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Periods)
