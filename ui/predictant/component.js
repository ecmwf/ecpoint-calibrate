import React, { Component, Fragment } from 'react'

import Database from './database'
import Computations from './computations'
import Parameters from './parameters'
import ComputationLogs from './ComputationLogs'

class Predictant extends Component {
  render () {
    if (this.props.page === 0) {
      return (
        <Fragment>
          <Database {...this.props} />
          <Parameters {...this.props} />
        </Fragment>
      )
    }

    if (this.props.page === 1) {
      return <Computations {...this.props} />
    }

    if (this.props.page === 2) {
      return <ComputationLogs {...this.props} />
    }
  }
}

export default Predictant
