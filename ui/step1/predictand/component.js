import React, { Component } from 'react'
import { remote } from 'electron'

import { Grid, Card, Button, Radio, Item, Icon, Label } from 'semantic-ui-react'

import { isEmpty } from './index'

const mainProcess = remote.require('./server')

class Database extends Component {
  getField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Select directory of the predictand (rainfall, temperature, etc.)</h5>
        </Item.Header>

        <Item.Description>
          <Button
            onClick={() => this.props.onPathChange(mainProcess.selectDirectory())}
          >
            Browse
          </Button>
        </Item.Description>
        <Item.Extra>
          {this.props.predictand.path && (
            <p>
              <b>Path:</b> {this.props.predictand.path}
            </p>
          )}
          {this.props.predictand.code && (
            <div>
              <b>Code:</b> <Label>{this.props.predictand.code}</Label>
            </div>
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  isComplete = () => !isEmpty(this.props.predictand)

  componentDidUpdate = prevProps => {
    this.props.updatePageCompletion(0, this.isComplete())
  }

  render() {
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="teal">
            <Card.Header>
              <Grid.Column floated="left">Select Predictand</Grid.Column>
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
}

export default Database
