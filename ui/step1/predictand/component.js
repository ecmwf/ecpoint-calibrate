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

  minValueAcc_field = () => (
    <Fragment>
      <br />
      <br />
      <Grid.Row>
        <Input
          error={this.minValueAcc_hasError()}
          placeholder="Enter a number"
          value={this.props.predictand.minValueAcc}
          onChange={e => this.props.change_minValueAcc(e.target.value)}
        />
      </Grid.Row>
      <Grid.Row>
        Select a minimum value to consider, to prevent division by zero. Chosen value
        must be consistent with units of computed values (defined later).
      </Grid.Row>
    </Fragment>
  )

  minValueAcc_hasError = () =>
    this.props.predictand.minValueAcc !== '' &&
    /^\d+$/.test(this.props.predictand.minValueAcc)
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
                content="An instantaneous value is the observation at a particular instant. For example, temperature."
                size="tiny"
              />
            </Grid.Column>
          </Grid>

          <strong>Predictand error to compute: </strong>
          {this.props.predictand.type === 'ACCUMULATED' ? (
            <span>Forecast Error Ratio (FER)</span>
          ) : (
            <span>Forecast Error (FE)</span>
          )}

          {this.props.predictand.type === 'ACCUMULATED' && this.minValueAcc_field()}
        </Item.Description>
        <Item.Extra />
      </Item.Content>
    </Item>
  )

  isComplete = () =>
    !isEmpty(this.props.predictand) &&
    (this.props.predictand.type === 'ACCUMULATED' ? !this.minValueAcc_hasError() : true)

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
              <Item.Group divided>
                {this.getField()}
                {this.getPredictantTypeSwitcher()}
              </Item.Group>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Database
