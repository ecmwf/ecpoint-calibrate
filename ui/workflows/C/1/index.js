import React from 'react'

import Cheaper from './cheaper'
import Preloader from './preloader'
import Binning from './binning'
import PDTViewer from './pdtViewer'

const Page1 = () => (
  <>
    <Preloader />
    <PDTViewer />
    <Binning />
    <Cheaper />
  </>
)

export default Page1
