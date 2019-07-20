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

  discretizationHasError = () =>
    this.props.observations.discretization === '' ||
    /^(1|2|3|4|6|12|24)$/.test(this.props.observations.discretization)
      ? null
      : true

  getDiscretizationField = () => (
    <Fragment>
      <Item.Header>
        <h3>Discretization</h3>
        <h5>
          Select the value, in hours, for the discretization of the accumulation
          period's starting times:
        </h5>
      </Item.Header>
      <Item.Extra>
        For example:
        <ul>
          <li>
            If observation periods start at hourly intervals, enter <code>1</code>.
          </li>
          <li>
            If observation periods start at 6-hourly intervals (e.g., 2, 8, 14, 20 UTC,
            enter <code>6</code>.
          </li>
        </ul>
      </Item.Extra>
      <Item.Description>
        <Input
          error={this.discretizationHasError()}
          onChange={e => this.props.onDiscretizationFieldChange(e.target.value)}
          value={this.props.observations.discretization || ''}
        />
      </Item.Description>
      <Item.Extra>
        Valid values are: <code>1</code>, <code>2</code>, <code>3</code>,<code>4</code>,{' '}
        <code>6</code>, <code>12</code>, and <code>24</code>.
      </Item.Extra>
    </Fragment>
  )

  startTimeHasError = () =>
    this.props.observations.startTime === '' ||
    (/^\d+$/.test(this.props.observations.startTime) &&
      this.props.observations.startTime >= 0 &&
      this.props.observations.startTime < 24)
      ? null
      : true

  getStartTimeField = () => (
    <Fragment>
      <Item.Header>
        <h3>Start time</h3>
        <h5>Select when, in UTC time, the observations start being collected:</h5>
      </Item.Header>
      <Item.Extra>
        For example:
        <ul>
          <li>
            If observations are collected from 0 UTC, enter <code>0</code>.
          </li>
          <li>
            If observations are collected from 2 UTC, enter <code>2</code>.
          </li>
        </ul>
      </Item.Extra>
      <Item.Description>
        <Input
          error={this.startTimeHasError()}
          onChange={e => this.props.onStartTimeFieldChange(e.target.value)}
          value={this.props.observations.startTime || ''}
        />
      </Item.Description>
      <Item.Extra>
        Valid values are integers between <code>0</code> and <code>23</code>.
      </Item.Extra>
    </Fragment>
  )

  hasError = () => this.startTimeHasError() || this.discretizationHasError()

  isComplete = () => !isEmpty(this.props.observations) && !this.hasError()

  componentDidUpdate = prevProps => {
    this.props.updatePageCompletion(0, this.isComplete())
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
              <Item>
                <Item.Content>
                  <Grid divided columns={2}>
                    <Grid.Column>{this.getStartTimeField()}</Grid.Column>
                    <Grid.Column>{this.getDiscretizationField()}</Grid.Column>
                  </Grid>
                </Item.Content>
              </Item>
            </Item.Group>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  )
}

export default Observation
