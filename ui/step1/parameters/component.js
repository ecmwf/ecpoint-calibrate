import React, { Component } from 'react'

import { Grid, Card, Button, Input, Item, Icon } from 'semantic-ui-react'

import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'

import { remote } from 'electron'

import { isEmpty } from './index'

const mainProcess = remote.require('./server')

class Parameters extends Component {
  getDateStartField = () => {
    const dateStart =
      this.props.parameters.date_start &&
      moment(this.props.parameters.date_start, 'YYYYMMDD')
    const dateEnd =
      this.props.parameters.date_end &&
      moment(this.props.parameters.date_end, 'YYYYMMDD')
    return (
      <Item>
        <Item.Content>
          <Grid columns={5}>
            <Grid.Column>
              <Item.Header>
                <h5>Start date</h5>
              </Item.Header>

              <Item.Description>
                <DatePicker
                  inline
                  showYearDropdown
                  scrollableYearDropdown
                  selectsStart
                  selected={dateStart}
                  startDate={dateStart}
                  endDate={dateEnd}
                  onChange={this.props.onParametersDateStartFieldChange}
                />
              </Item.Description>
            </Grid.Column>
            <Grid.Column>
              <Item.Header>
                <h5>End date</h5>
              </Item.Header>

              <Item.Description>
                <DatePicker
                  inline
                  showYearDropdown
                  scrollableYearDropdown
                  selectsEnd
                  selected={dateEnd}
                  startDate={dateStart}
                  endDate={dateEnd}
                  onChange={this.props.onParametersDateEndFieldChange}
                />
              </Item.Description>
            </Grid.Column>
          </Grid>
        </Item.Content>
      </Item>
    )
  }

  limSUHasError = () =>
    this.props.parameters.limSU === '' || /^\d+$/.test(this.props.parameters.limSU)
      ? null
      : true

  getLimSUField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>
            Enter upper limit (in hours) of the window in the forecast with spin-up
            problems:
          </h5>
        </Item.Header>

        <Item.Description>
          <Input
            error={this.limSUHasError()}
            onChange={e => this.props.onParametersLimSUFieldChange(e.target.value)}
            value={this.props.parameters.limSU || ''}
          />
        </Item.Description>
      </Item.Content>
    </Item>
  )

  rangeHasError = () =>
    this.props.parameters.range === '' || /^\d+$/.test(this.props.parameters.range)
      ? null
      : true

  getRangeField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Enter a range for the Leadtime (in hours):</h5>
        </Item.Header>

        <Item.Description>
          <Input
            error={this.rangeHasError()}
            onChange={e => this.props.onParametersRangeFieldChange(e.target.value)}
            value={this.props.parameters.range || ''}
          />
        </Item.Description>
      </Item.Content>
    </Item>
  )

  getPathOutField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Select output filename and directory for storing results:</h5>
        </Item.Header>

        <Item.Description>
          <Button onClick={() => this.props.onOutPathChange(mainProcess.saveFile())}>
            Browse
          </Button>
        </Item.Description>
        <Item.Extra>{this.props.parameters.outPath}</Item.Extra>
      </Item.Content>
    </Item>
  )

  hasError = () => this.rangeHasError() || this.limSUHasError()

  isComplete = () => !this.hasError() && !isEmpty(this.props.parameters)

  componentDidUpdate = prevProps => {
    this.props.updatePageCompletion(0, this.isComplete())
  }

  render = () => (
    <Grid container centered>
      <Grid.Column>
        <Card fluid color="teal">
          <Card.Header>
            <Grid.Column floated="left">Parameters</Grid.Column>
            <Grid.Column floated="right">
              {this.isComplete() && <Icon name="check circle" />}
            </Grid.Column>
          </Card.Header>
          <Card.Content>
            <Card.Description />
            <Item.Group divided>
              {this.getDateStartField()}
              {this.getLimSUField()}
              {this.getRangeField()}
              {this.getPathOutField()}
            </Item.Group>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  )
}

export default Parameters
