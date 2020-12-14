import React from 'react'

import Cheaper from './cheaper'
import Preloader from './preloader'
import Binning from './binning'
import PDTViewer from './pdtViewer'
import Summary from './summary'

const Page1 = () => (
  <>
    <Preloader />
    <Summary />
    <PDTViewer />
    <Binning />
    <Cheaper />
  </>
)

export default Page1
