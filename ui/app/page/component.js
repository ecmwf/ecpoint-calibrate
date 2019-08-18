import React from 'react'

import WorkflowB_Page1 from '~/workflows/B/1'
import WorkflowB_Page2 from '~/workflows/B/2'
import WorkflowB_Page3 from '~/workflows/B/3'
import WorkflowC_Page1 from '~/workflows/C/1'
import WorkflowC_Page2 from '~/workflows/C/2'

import MenuFactory from '~/app/menu'

const WorkflowB_Menu = MenuFactory([
  {
    icon: 'cloud upload',
    title: 'Input Parameters',
  },
  {
    icon: 'code',
    title: 'Computations (Define Predictors)',
  },
  {
    icon: 'cogs',
    title: 'Processing (Create Point Data Table)',
  },
])
const WorkflowC_Menu = MenuFactory([
  {
    icon: 'chart bar',
    title: 'Input Parameters',
  },
  {
    icon: 'cogs',
    title: 'Post-Processing',
  },
])

const Page = props => {
  if (props.workflow === 'B' && props.page.activePageNumber === 1) {
    return (
      <>
        <WorkflowB_Menu {...props} />
        <WorkflowB_Page1 />
      </>
    )
  }
  if (props.workflow === 'B' && props.page.activePageNumber === 2) {
    return (
      <>
        <WorkflowB_Menu {...props} />
        <WorkflowB_Page2 />
      </>
    )
  }
  if (props.workflow === 'B' && props.page.activePageNumber === 3) {
    return (
      <>
        <WorkflowB_Menu {...props} />
        <WorkflowB_Page3 />
      </>
    )
  }
  if (props.workflow === 'C' && props.page.activePageNumber === 1) {
    return (
      <>
        <WorkflowC_Menu {...props} />
        <WorkflowC_Page1 />
      </>
    )
  }

  if (props.workflow === 'C' && props.page.activePageNumber === 2) {
    return (
      <>
        <WorkflowC_Menu {...props} />
        <WorkflowC_Page2 />
      </>
    )
  }
}

export default Page
