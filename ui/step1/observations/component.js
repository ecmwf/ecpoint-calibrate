import React, { Component, Fragment } from 'react'
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
} from 'semantic-ui-react'

import { isEmpty } from './index'

const mainProcess = remote.require('./server')

class Observation extends Component {
  getField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Select the directory that contains the observations:</h5>
        </Item.Header>

        <Item.Description>
          <Button
            onClick={() => this.props.onPathChange(mainProcess.selectDirectory())}
          >
            Browse
          </Button>
        </Item.Description>
        <Item.Extra>
          {this.props.observations.path && (
            <p>
              <b>Path:</b> <code>{this.props.observations.path}</code>
            </p>
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  hasError = () => false

  isComplete = () => !isEmpty(this.props.observations) && !this.hasError()

  componentDidUpdate = prevProps => {
    this.props.updatePageCompletion(0, this.isComplete())
  }

  render = () => (
    <Grid container centered>
      <Grid.Column>
        <Card fluid color="black">
          <Card.Header>
            <Grid.Column floated="left">Observational Data</Grid.Column>
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
  )
}

export default Observation
