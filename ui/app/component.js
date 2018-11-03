import React, { Fragment, Component } from 'react'

import { Modal, Button, Image, Grid } from 'semantic-ui-react'

import Header from './header'
import Menu from './menu'
import Page from './page'

class App extends Component {
  getApp = fromScratch => (
    <Fragment>
      <Header />
      <Menu fromScratch={fromScratch} />
      <Page fromScratch={fromScratch} />
    </Fragment>
  )

  getAppSwitcher = () => (
    <Modal
      dimmer={true}
      open={true}
      onClose={this.close}
      closeOnEscape={false}
      closeOnDimmerClick={false}
    >
      <Modal.Header>Welcome to ecPoint-pyCal</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            ecPoint-Cal is software that compares numerical model outputs against point
            observations to identify biases/errors at local scale. It provides a dynamic
            environment to post-process model parameters to produce probabilistic
            products for geographical locations.
          </p>
          <p>
            To use ecPoint-pyCal, you can either start from scratch or load a
            pre-computed ASCII file.
          </p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="black"
          icon="cloud upload"
          labelPosition="right"
          content="Load a pre-computed ascii table"
          onClick={() => this.props.setScratchValue(false)}
        />
        <Button
          positive
          icon="edit outline"
          labelPosition="right"
          content="Start from scratch"
          onClick={() => this.props.setScratchValue(true)}
        />
      </Modal.Actions>
    </Modal>
  )

  render = () => {
    if (this.props.app.scratch === null) {
      return this.getAppSwitcher()
    }

    return this.getApp(this.props.app.scratch)
  }
}

export default App
