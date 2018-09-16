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

class Preloader extends Component {
  getField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Select ascii table file containing the pre-computed fields.</h5>
        </Item.Header>

        <Item.Description>
          <Button
            onClick={() => this.props.onPathChange(mainProcess.openFile() || null)}
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

  render() {
    console.log(this.props.path)
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="teal">
            <Card.Header>
              <Grid.Column floated="left">
                Select ascii table file containing computed fields
              </Grid.Column>
              <Grid.Column floated="right">{<Icon name="check circle" />}</Grid.Column>
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

export default Preloader
