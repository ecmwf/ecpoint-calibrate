import React, { Component, Fragment } from 'react'

import SelectPredictant from './SelectPredictant'
import PredictantErrors from './PredictantErrors'
import Parameters from './Parameters'

class Predictant extends Component {
  render() {
    if (this.props.page === 0) {
      return (
        <Fragment>
          <SelectPredictant {...this.props} />
          <Parameters {...this.props} />
        </Fragment>
      )
    }

    if (this.props.page === 1) {
      return <PredictantErrors />
    }

    if (this.props.page === 2) {
      return null
    }
  }
}

export default Predictant
