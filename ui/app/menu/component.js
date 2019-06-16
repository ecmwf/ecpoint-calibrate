import React from 'react'
import _ from 'lodash'

import { Icon, Step } from 'semantic-ui-react'

const isPageComplete = page => _.every(_.values(page.isComplete))

const Menu = props => (
  <Step.Group widths={4}>
    <Step
      active={props.page[0].isActive ? true : null}
      onClick={() => props.onPageChange(0)}
    >
      <Icon name="cloud upload" />
      <Step.Content>
        <Step.Title>Input Parameters</Step.Title>
      </Step.Content>
    </Step>
    <Step
      active={props.page[1].isActive ? true : null}
      disabled={!isPageComplete(props.page[0])}
      onClick={() => props.onPageChange(1)}
    >
      <Icon name="code" />
      <Step.Content>
        <Step.Title>Computations</Step.Title>
      </Step.Content>
    </Step>
    <Step
      active={props.page[2].isActive ? true : null}
      disabled={!isPageComplete(props.page[0]) || !isPageComplete(props.page[1])}
      onClick={() => props.onPageChange(2)}
    >
      <Icon name="cogs" />
      <Step.Content>
        <Step.Title>Processing</Step.Title>
      </Step.Content>
    </Step>
    <Step
      active={props.page[3].isActive ? true : null}
      disabled={
        !isPageComplete(props.page[0]) ||
        !isPageComplete(props.page[1]) ||
        !isPageComplete(props.page[2])
      }
      onClick={() => props.onPageChange(3)}
    >
      <Icon name="chart bar" />
      <Step.Content>
        <Step.Title>Post Processing</Step.Title>
      </Step.Content>
    </Step>
  </Step.Group>
)

export default Menu
