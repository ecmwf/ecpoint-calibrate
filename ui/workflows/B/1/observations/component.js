import React, { Component } from 'react'

import { Grid, Input, Card, Button, Item, Icon, Message } from 'semantic-ui-react'

import { isEmpty } from './index'

const mainProcess = require('@electron/remote').require('./server')

class Observation extends Component {
  getObsPathField = () => (
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

  getObsFormatWarning() {
    console.log(this.props.observations.displayWarning)
    return (
      this.props.observations.displayWarning && (
        <Message attached="bottom" warning>
          <Icon name="warning" />
          Unable to detect units from observational data. Please enter manually.
        </Message>
      )
    )
  }

  getObsUnitsField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Enter the units in which the observations are stored:</h5>
        </Item.Header>

        <Item.Description>
          <Input
            onChange={e => {
              this.props.onUnitsChange(e.target.value)
              this.props.setWarning(false)
            }}
            value={this.props.observations.units || ''}
          />
        </Item.Description>
      </Item.Content>
    </Item>
  )

  hasError = () => false

  isComplete = () => !isEmpty(this.props.observations) && !this.hasError()

  componentDidUpdate = prevProps => {
    this.isComplete() && this.props.completeSection()
  }

  render = () => (
    <Grid container centered>
      <Grid.Column>
        <Card fluid color="black">
          <Card.Header>
            <Grid.Column floated="left">
              Observational Data — Select observations
            </Grid.Column>
            <Grid.Column floated="right">
              {this.isComplete() && <Icon name="check circle" />}
            </Grid.Column>
          </Card.Header>
          <Card.Content>
            <Card.Description />
            <Item.Group divided>
              {this.getObsPathField()}
              {this.getObsUnitsField()}
            </Item.Group>
            {this.getObsFormatWarning()}
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  )
}

export default Observation
