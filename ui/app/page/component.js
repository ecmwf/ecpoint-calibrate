import React, { Component } from 'react'

import Step1 from '../../step1'
import Step2 from '../../step2'
import Step3 from '../../step3'

class Page extends Component {
  render () {
    if (this.props.page === 0) {
      return <Step1 />
    }

    if (this.props.page === 1) {
      return <Step2 />
    }

    if (this.props.page === 2) {
      return <Step3 />
    }
  }
}

export default Page
