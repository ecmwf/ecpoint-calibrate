import React, { Fragment } from 'react'

import WorkflowB_Page1 from '~/workflows/B/pages/1'
import WorkflowB_Page2 from '~/workflows/B/pages/2'
import WorkflowB_Page3 from '~/workflows/B/pages/3'
import WorkflowC_Page1 from '~/workflows/C/pages/1'
import WorkflowC_Page2 from '~/workflows/C/pages/2'

import MenuFactory from '~/app/menu'

const WorkflowB_Menu = MenuFactory([
  {
    icon: 'cloud upload',
    title: 'Input Parameters',
  },
  {
    icon: 'code',
    title: 'Computations',
  },
  {
    icon: 'cogs',
    title: 'Processing',
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
      <Fragment>
        <WorkflowB_Menu {...props} />
        <WorkflowB_Page1 />
      </Fragment>
    )
  }
  if (props.workflow === 'B' && props.page.activePageNumber === 2) {
    return (
      <Fragment>
        <WorkflowB_Menu {...props} />
        <WorkflowB_Page2 />
      </Fragment>
    )
  }
  if (props.workflow === 'B' && props.page.activePageNumber === 3) {
    return (
      <Fragment>
        <WorkflowB_Menu {...props} />
        <WorkflowB_Page3 />
      </Fragment>
    )
  }
  if (props.workflow === 'C' && props.page.activePageNumber === 1) {
    return (
      <Fragment>
        <WorkflowC_Menu {...props} />
        <WorkflowC_Page1 />
      </Fragment>
    )
  }

  if (props.workflow === 'C' && props.page.activePageNumber === 2) {
    return (
      <Fragment>
        <WorkflowC_Menu {...props} />
        <WorkflowC_Page2 />
      </Fragment>
    )
  }
}

export default Page
