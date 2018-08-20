import React from 'react'

import Step1 from '~/step1'
import Step2 from '~/step2'
import Step3 from '~/step3'
import Step4 from '~/step4'

const Page = props => {
  if (props.page[0].isActive) {
    return <Step1 />
  }
  if (props.page[1].isActive) {
    return <Step2 />
  }
  if (props.page[2].isActive) {
    return <Step3 />
  }
  if (props.page[3].isActive) {
    return <Step4 />
  }
}

export default Page
