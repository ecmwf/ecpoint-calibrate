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

const mainProcess = remote.require('./server')

class Predictand extends Component {
  getField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Select the directory that contains the predictand:</h5>
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
              <b>Path:</b> <code>{this.props.predictand.path}</code>
            </p>
          )}
          {this.props.predictand.code && (
            <p>
              <b>Predictand Code:</b> <Label>{this.props.predictand.code}</Label>
            </p>
          )}

          {this.props.predictand.units && (
            <p>
              <b>Units:</b> <code>{this.props.predictand.units}</code>
            </p>
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  accHasError = () =>
    this.props.predictand.accumulation === '' ||
    /^(6|12|24)$/.test(this.props.predictand.accumulation)
      ? null
      : true

  getAccField = () => (
    <Fragment>
      <Item>
        <Item.Content>
          <Item.Header>
            <h5>Enter an accumulation period, in hours, for the predictand:</h5>
          </Item.Header>
          <Item.Extra>
            For example, insert the value <code>24</code> for a 24-hour accumulation
            period.
          </Item.Extra>

          <Item.Description>
            <Input
              error={this.accHasError()}
              onChange={e => this.props.onAccumulationChange(e.target.value)}
              value={this.props.predictand.accumulation || ''}
              label={{ basic: true, content: 'hours' }}
              labelPosition="right"
            />
          </Item.Description>
          <Item.Extra>
            Valid values are: <code>6</code>, <code>12</code>, <code>24</code>
          </Item.Extra>
        </Item.Content>
      </Item>
    </Fragment>
  )

  minValueAccField = () => (
    <Fragment>
      <Item>
        <Item.Content>
          <Item.Header>
            <h5>
              Enter a minimum value for the predictand to prevent dividing by zero:
            </h5>
          </Item.Header>
          <Item.Extra>
            For example, enter the value <code>1</code> for{' '}
            <code>1 mm</code> over the accumulation period.
            <br />
            The entered value must be consistent with the units in which the predictand
            is represented.
          </Item.Extra>

          <Item.Description>
            <Input
              error={this.minValueAcc_hasError()}
              placeholder="Enter a number"
              value={this.props.predictand.minValueAcc}
              onChange={e => this.props.change_minValueAcc(e.target.value)}
              label={{ basic: true, content: this.props.predictand.units || '' }}
              labelPosition="right"
            />
          </Item.Description>
          <Item.Extra />
        </Item.Content>
      </Item>
    </Fragment>
  )

  minValueAcc_hasError = () =>
    this.props.predictand.minValueAcc === '' ||
    /^(\d+\.?\d*|\.\d+)$/.test(this.props.predictand.minValueAcc)
      ? null
      : true

  getPredictantTypeSwitcher = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Select the type of predictand:</h5>
        </Item.Header>

        <Item.Description>
          <Grid columns={2} padded>
            <Grid.Column>
              <Radio
                label="Accumulated"
                value="ACCUMULATED"
                checked={this.props.predictand.type === 'ACCUMULATED'}
                onChange={() => this.props.onTypeChange('ACCUMULATED')}
              />
              &nbsp;&nbsp;&nbsp;
              <Popup
                trigger={<Icon name="info circle" />}
                content="An accumulated value is derived over a period of time. For example, total precipitation."
                size="tiny"
              />
            </Grid.Column>
            <Grid.Column>
              <Radio
                label="Instantaneous"
                value="INSTANTANEOUS"
                checked={this.props.predictand.type === 'INSTANTANEOUS'}
                onChange={() => this.props.onTypeChange('INSTANTANEOUS')}
              />
              &nbsp;&nbsp;&nbsp;
              <Popup
                trigger={<Icon name="info circle" />}
                content="An instantaneous value is one that corresponds to a particular instant in time, eg. temperature."
                size="tiny"
              />
            </Grid.Column>
          </Grid>
          {this.props.predictand.type && (
            <strong>Type of error that will be computed: </strong>
          )}
          {this.props.predictand.type &&
            (this.props.predictand.type === 'ACCUMULATED' ? (
              <span>Forecast Error Ratio (FER)</span>
            ) : (
              <span>Forecast Error (FE)</span>
            ))}
        </Item.Description>
        <Item.Extra />
      </Item.Content>
    </Item>
  )

  hasError = () =>
    this.accHasError() ||
    (this.props.predictand.type === 'ACCUMULATED' ? this.minValueAcc_hasError() : false)

  isComplete = () => !this.isEmpty(this.props.predictand) && !this.hasError()

  isEmpty = predictand =>
    !(
      this.props.predictand.path &&
      this.props.predictand.type &&
      (this.props.predictand.type === 'ACCUMULATED'
        ? this.props.predictand.accumulation
        : true) &&
      (this.props.predictand.type === 'ACCUMULATED'
        ? this.props.predictand.minValueAcc
        : true)
    )

  componentDidUpdate = prevProps => {
    this.isComplete() && this.props.completeSection()
  }

  render() {
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="black">
            <Card.Header>
              <Grid.Column floated="left">Model data — Predictand</Grid.Column>
              <Grid.Column floated="right">
                {this.isComplete() && <Icon name="check circle" />}
              </Grid.Column>
            </Card.Header>
            <Card.Content>
              <Card.Description />
              <Item.Group divided>
                {this.getField()}
                {this.getPredictantTypeSwitcher()}
                {this.props.predictand.type === 'ACCUMULATED' && this.getAccField()}
                {this.props.predictand.type === 'ACCUMULATED' &&
                  this.minValueAccField()}
              </Item.Group>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Predictand
