import React, { Component, Fragment } from 'react'

import { Icon, Step, Header, Segment, Image } from 'semantic-ui-react'

const Menu = props => (
  <Fragment>
    <div
      style={{ paddingLeft: '20px', paddingBottom: '10px', paddingTop: '20px' }}
    >
      <Image
        src="https://www.ecmwf.int/sites/default/files/ECMWF_Master_Logo_RGB_nostrap.png"
        size="small"
        verticalAlign="bottom"
      />
      <span style={{ paddingLeft: '20px' }}>
        European Centre for Medium-Range Weather Forecasts
      </span>
    </div>

    <Step.Group widths={3}>
      <Step onClick={() => props.onPageChange(0)}>
        <Icon name="cloud upload" />
        <Step.Content>
          <Step.Title>Input Parameters</Step.Title>
        </Step.Content>
      </Step>
      <Step active onClick={() => props.onPageChange(1)}>
        <Icon name="cogs" />
        <Step.Content>
          <Step.Title>Computations</Step.Title>
        </Step.Content>
      </Step>
      <Step onClick={() => props.onPageChange(2)}>
        <Icon name="chart bar" />
        <Step.Content>
          <Step.Title>Result</Step.Title>
        </Step.Content>
      </Step>
    </Step.Group>
  </Fragment>
)

export default Menu
