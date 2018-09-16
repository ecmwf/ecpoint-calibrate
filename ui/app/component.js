import React, { Fragment, Component } from 'react'

import { Modal, Button, Image, Grid } from 'semantic-ui-react'

import Header from './header'
import Menu from './menu'
import Page from './page'

class App extends Component {
  state = { scratch: null, open: true }

  close = () => this.setState({ open: false })

  getApp = fromScratch => (
    <Fragment>
      <Header />
      <Menu fromScratch={fromScratch} />
      <Page fromScratch={fromScratch} />
    </Fragment>
  )

  setPreload = () => {
    this.props.onPageChange(3)
    this.setState({ scratch: false })
  }

  getAppSwitcher = () => (
    <Modal
      dimmer={true}
      open={this.state.open}
      onClose={this.close}
      closeOnEscape={false}
      closeOnDimmerClick={false}
    >
      <Modal.Header>Welcome to ecPoint-pyCal</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>Write something here.</p>
          <p>TBA</p>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          color="black"
          icon="cloud upload"
          labelPosition="right"
          content="Load a pre-computed ascii table"
          onClick={() => this.setPreload()}
        />
        <Button
          positive
          icon="edit outline"
          labelPosition="right"
          content="Start from scratch"
          onClick={() => this.setState({ scratch: true })}
        />
      </Modal.Actions>
    </Modal>
  )

  render = () => {
    if (this.state.scratch === null) {
      return this.getAppSwitcher()
    }

    return this.getApp(this.state.scratch)
  }
}

export default App
