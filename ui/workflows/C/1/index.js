import React from 'react'

import Cheaper from './cheaper'
import Preloader from './preloader'
import Binning from './binning'

const Page1 = props => (
  <>
    <Preloader />
    <Binning />
    <Cheaper />
  </>
)

export default Page1
