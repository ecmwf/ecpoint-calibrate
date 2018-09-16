import React, { Fragment } from 'react'

import PostProcessing from './postprocessing'
import Preloader from './preloader'

const Step4 = props => (
  <Fragment>
    <Preloader />
    <PostProcessing />
  </Fragment>
)

export default Step4
