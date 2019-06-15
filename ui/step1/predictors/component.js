import React, { Component } from 'react'
import { remote } from 'electron'

import { Grid, Card, Button, Radio, Item, Icon, Label } from 'semantic-ui-react'

import { isEmpty } from './index'

const mainProcess = remote.require('./server')

class Predictors extends Component {
  getField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>
            Select the directory that contains the model data for the computation of the
            predictors:
          </h5>
        </Item.Header>

        <Item.Description>
          <Button
            onClick={() => this.props.onPathChange(mainProcess.selectDirectory())}
          >
            Browse
          </Button>
        </Item.Description>
        <Item.Extra>
          {this.props.predictors.path && (
            <div>
              <b>Path:</b> {this.props.predictors.path}
            </div>
          )}
          {this.props.predictors.codes.length !== 0 && (
            <div>
              <b>Predictor short names:</b>{' '}
              {this.props.predictors.codes.map(code => (
                <Label key={code}>{code}</Label>
              ))}
            </div>
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  isComplete = () => !isEmpty(this.props.predictors)

  componentDidUpdate = prevProps => {
    this.props.updatePageCompletion(0, this.isComplete())
  }

  render() {
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="teal">
            <Card.Header>
              <Grid.Column floated="left">Select Predictors</Grid.Column>
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

export default Predictors
