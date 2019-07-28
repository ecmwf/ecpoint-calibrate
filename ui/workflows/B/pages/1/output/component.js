import React, { Component } from 'react'

import { Grid, Card, Button, Input, Item, Icon, Radio, Popup } from 'semantic-ui-react'

import { remote } from 'electron'

import { isEmpty } from './index'

const mainProcess = remote.require('./server')

class Output extends Component {
  getPathOutField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h3>Point data table</h3>
          <h5>Select or create the file that will contain the point data table:</h5>
        </Item.Header>

        <Item.Description>
          <Button onClick={() => this.props.onOutPathChange(mainProcess.saveFile())}>
            Browse
          </Button>
        </Item.Description>
        <Item.Extra>
          {this.props.parameters.outPath && (
            <p>
              <b>Path:</b> <code>{this.props.parameters.outPath}</code>
            </p>
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  isComplete = () => !isEmpty(this.props.parameters)

  componentDidUpdate = prevProps => {
    this.isComplete() && this.props.completeSection()
  }

  render = () => (
    <Grid container centered>
      <Grid.Column>
        <Card fluid color="black">
          <Card.Header>
            <Grid.Column floated="left">Output Data</Grid.Column>
            <Grid.Column floated="right">
              {this.isComplete() && <Icon name="check circle" />}
            </Grid.Column>
          </Card.Header>
          <Card.Content>
            <Card.Description />
            <Item.Group divided>{this.getPathOutField()}</Item.Group>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  )
}

export default Output
