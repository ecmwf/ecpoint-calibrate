import React, { Component } from 'react'
import { remote } from 'electron'

import {
  Grid,
  Input,
  Card,
  Button,
  Radio,
  Item,
  Icon,
  Label,
  Popup,
  Dimmer,
  Loader,
} from 'semantic-ui-react'

import { isEmpty } from './index'

const mainProcess = remote.require('./server')

class Preloader extends Component {
  getField = () => (
    <Item>
      <Item.Content>
        <Item.Description>
          <Button
            onClick={() => {
              this.props.onPathChange(mainProcess.openFile() || null)
            }}
          >
            Browse
          </Button>
        </Item.Description>
        <Item.Extra>
          {this.props.outPath ? (
            <p>
              <b>Path:</b> {this.props.path}
            </p>
          ) : (
            this.props.path
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  hasError = () => false

  isComplete = () => !this.hasError() && this.props.path !== null

  componentDidUpdate = prevProps => {
    this.isComplete() && this.props.completeSection()
  }

  render = () => (
    <>
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="black">
            <Card.Header>
              <Grid.Column floated="left">Select point data table</Grid.Column>
              <Grid.Column floated="right">
                {this.isComplete() && <Icon name="check circle" />}
              </Grid.Column>
            </Card.Header>
            <Card.Content>
              <Card.Description />
              <Item.Group divided>{this.getField()}</Item.Group>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
      <Dimmer active={this.props.loading}>
        <Loader indeterminate>Reading point-data table. Please wait.</Loader>
      </Dimmer>
    </>
  )
}

export default Preloader
