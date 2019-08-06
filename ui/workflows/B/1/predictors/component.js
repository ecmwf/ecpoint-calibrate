import React, { Component } from 'react'
import { remote } from 'electron'

import { Grid, Card, Button, Radio, Item, Icon, Label, Input } from 'semantic-ui-react'

const mainProcess = remote.require('./server')

class Predictors extends Component {
  getField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>
            Select the directory that contains the variables that will be used to
            compute the predictors:
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
              <b>Path:</b> <code>{this.props.predictors.path}</code>
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

  samplingIntervalFieldHasError = () => {
    const isNumber = /^\d+$/.test(this.props.predictors.sampling_interval)

    if (!isNumber) {
      return false
    }

    const ratio =
      parseInt(this.props.predictand.accumulation, 10) /
      parseInt(this.props.predictors.sampling_interval, 10)
    return ratio !== parseInt(ratio, 10) || parseInt(ratio, 10) === 0
  }

  getSamplingIntervalField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Enter the forecast data sampling interval in computations:</h5>
        </Item.Header>

        <Item.Description>
          <Input
            error={this.samplingIntervalFieldHasError()}
            onChange={e => this.props.onSamplingIntervalChange(e.target.value)}
            value={this.props.predictors.sampling_interval || ''}
            label={{ basic: true, content: 'hours' }}
            labelPosition="right"
          />
        </Item.Description>
        <Item.Extra>
          Valid values should divide the accumulation value:{' '}
          {this.props.predictand.accumulation && (
            <code>{this.props.predictand.accumulation}</code>
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  isComplete = () =>
    this.props.predictors.codes.length > 0 &&
    !!this.props.predictors.sampling_interval &&
    !this.samplingIntervalFieldHasError()

  componentDidUpdate = prevProps => {
    this.isComplete() && this.props.completeSection()
  }

  render() {
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="black">
            <Card.Header>
              <Grid.Column floated="left">
                Model data — Variables to compute predictors
              </Grid.Column>
              <Grid.Column floated="right">
                {this.isComplete() && <Icon name="check circle" />}
              </Grid.Column>
            </Card.Header>
            <Card.Content>
              <Card.Description />
              <Item.Group divided>
                {this.getField()}
                {this.getSamplingIntervalField()}
              </Item.Group>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Predictors
