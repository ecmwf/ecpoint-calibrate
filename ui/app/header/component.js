import React, { Fragment } from 'react'
import _ from 'lodash'

import { Icon, Step, Image } from 'semantic-ui-react'

const isPageComplete = page => _.every(_.values(page.isComplete))

const Menu = props => (
  <Fragment>
    <div style={{ paddingLeft: '20px', paddingBottom: '10px', paddingTop: '20px' }}>
      <Image
        src="https://www.ecmwf.int/sites/default/files/ECMWF_Master_Logo_RGB_nostrap.png"
        size="small"
        verticalAlign="bottom"
      />
      <span style={{ paddingLeft: '20px' }}>
        European Centre for Medium-Range Weather Forecasts
      </span>
    </div>

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
        onClick={() => props.onPageChange(3)}
      >
        <Icon name="chart bar" />
        <Step.Content>
          <Step.Title>Post Processing</Step.Title>
        </Step.Content>
      </Step>
    </Step.Group>
  </Fragment>
)

export default Menu
