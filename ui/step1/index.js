import React, { Fragment } from 'react'

import Database from './database'
import Parameters from './parameters'

const Step1 = props => (
  <Fragment>
    <Database />
    <Parameters />
  </Fragment>
)

export default Step1
