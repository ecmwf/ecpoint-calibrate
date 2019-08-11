import React, { Component, Fragment } from 'react'

import { Grid, Card, Button, Input, Item, Icon, Radio, Popup } from 'semantic-ui-react'

import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'

import { remote } from 'electron'

import { isEmpty } from './index'

const mainProcess = remote.require('./server')

class Parameters extends Component {
  getTypeField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h3>Model Data Format</h3>
          <h5>Select the type of model data:</h5>
        </Item.Header>

        <Item.Description>
          <Grid columns={2}>
            <Grid.Column>
              <Radio
                label="GRIB"
                value="grib"
                checked={this.props.parameters.modelType === 'grib'}
                onChange={() => this.props.onModelTypeChange('grib')}
              />
              &nbsp;&nbsp;&nbsp;
              <Popup
                trigger={<Icon name="info circle" />}
                content="General Regularly-distributed Information in Binary form"
                size="tiny"
              />
            </Grid.Column>
            <Grid.Column>
              <Radio
                label="NetCDF"
                value="netcdf"
                checked={this.props.parameters.modelType === 'netcdf'}
                onChange={() => this.props.onModelTypeChange('netcdf')}
                disabled={true}
              />
              &nbsp;&nbsp;&nbsp;
              <Popup
                trigger={<Icon name="info circle" />}
                content="NETwork Common Data Form"
                size="tiny"
              />
            </Grid.Column>
          </Grid>
        </Item.Description>
      </Item.Content>
    </Item>
  )

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
          <Item.Header>
            <h3>Calibration period (Model data time)</h3>
            <br />
          </Item.Header>

          <Grid columns={2}>
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
          <h3>Spin-up Window</h3>
          <h5>
            Enter upper limit, for the spin-up window: &nbsp;&nbsp;&nbsp;
            <Popup trigger={<Icon name="info circle" />} size="tiny">
              Model data for forecast lead time less than or equal to the value entered
              will not be used for the point data table
            </Popup>
          </h5>
        </Item.Header>

        <Item.Description>
          <Input
            error={this.limSUHasError()}
            onChange={e => this.props.onParametersLimSUFieldChange(e.target.value)}
            value={this.props.parameters.limSU || ''}
            label={{ basic: true, content: 'hours' }}
            labelPosition="right"
          />
        </Item.Description>
      </Item.Content>
    </Item>
  )

  intervalHasError = () =>
    this.props.parameters.interval === '' ||
    /^(1|2|3|4|6|12|24)$/.test(this.props.parameters.interval)
      ? null
      : true

  getIntervalField = () => (
    <Fragment>
      <h5>Interval between model runs:</h5>
      <Input
        error={this.intervalHasError()}
        onChange={e => this.props.onIntervalFieldChange(e.target.value)}
        value={this.props.parameters.interval || ''}
        label={{ basic: true, content: 'hours' }}
        labelPosition="right"
      />
    </Fragment>
  )

  startTimeHasError = () =>
    this.props.parameters.startTime === '' ||
    (/^\d+$/.test(this.props.parameters.startTime) &&
      this.props.parameters.startTime >= 0 &&
      this.props.parameters.startTime < 24)
      ? null
      : true

  getStartTimeField = () => (
    <Fragment>
      <h5>First model run on a day:</h5>
      <Input
        error={this.startTimeHasError()}
        onChange={e => this.props.onStartTimeFieldChange(e.target.value)}
        value={this.props.parameters.startTime || ''}
        label={{ basic: true, content: 'UTC' }}
        labelPosition="right"
      />
    </Fragment>
  )

  hasError = () =>
    this.limSUHasError() || this.startTimeHasError() || this.intervalHasError()

  isComplete = () => !this.hasError() && !isEmpty(this.props.parameters)

  componentDidUpdate = prevProps => {
    this.isComplete() && this.props.completeSection()
  }

  render = () => (
    <Grid container centered>
      <Grid.Column>
        <Card fluid color="black">
          <Card.Header>
            <Grid.Column floated="left">Model Data — General parameters</Grid.Column>
            <Grid.Column floated="right">
              {this.isComplete() && <Icon name="check circle" />}
            </Grid.Column>
          </Card.Header>
          <Card.Content>
            <Card.Description />

            <Grid divided>
              <Grid.Column width={9}>
                <Item.Group divided>
                  {this.getTypeField()}
                  <Item>
                    <Item.Content>
                      <Item.Header>
                        <h3>Model Runs</h3>
                        <h5>
                          Select which model runs are going to be considered in the
                          calibration.
                        </h5>
                      </Item.Header>
                      <Item.Extra>
                        For example, if the considered model runs in the calibration are
                        00, 06, 12, and 18 UTC, enter <code>0</code> and <code>6</code>{' '}
                        in the boxes below.
                      </Item.Extra>
                      <br />
                      <Grid divided columns={2}>
                        <Grid.Column>{this.getStartTimeField()}</Grid.Column>
                        <Grid.Column>{this.getIntervalField()}</Grid.Column>
                      </Grid>
                    </Item.Content>
                  </Item>
                  {this.getLimSUField()}
                </Item.Group>
              </Grid.Column>

              <Grid.Column width={7}>{this.getDateStartField()}</Grid.Column>
            </Grid>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
  )
}

export default Parameters
