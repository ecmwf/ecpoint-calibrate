import React, { Component } from 'react'

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
            <h3>Calibration Period</h3>
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
          <h3>Spin-up</h3>
          <h5>
            Enter upper limit, in hours, for the spin-up window in the model data:
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
    this.props.parameters.range === '' ||
    /^(1|2|3|3|4|6|12|24)$/.test(this.props.parameters.range)
      ? null
      : true

  getRangeField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h3>Range</h3>
          <h5>Discretization of accumulation period's starting times (in hours):</h5>
        </Item.Header>
        <Item.Extra>
          Examples:
          <ul>
            <li>
              If observation period starts at <code>0</code>, <code>6</code>,{' '}
              <code>12</code>, <code>18</code> UTC, then enter <code>6</code>.
            </li>
            <li>
              If observation period starts at <code>0</code>, <code>12</code> UTC, then
              enter <code>12</code>.
            </li>
          </ul>
        </Item.Extra>
        <Item.Description>
          <Input
            error={this.rangeHasError()}
            onChange={e => this.props.onParametersRangeFieldChange(e.target.value)}
            value={this.props.parameters.range || ''}
          />
        </Item.Description>
        <Item.Extra>
          Valid values are: <code>1</code>, <code>2</code>, <code>3</code>,{' '}
          <code>4</code>, <code>6</code>, <code>12</code>, and <code>24</code>.
        </Item.Extra>
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
                  {this.getLimSUField()}
                  {this.getRangeField()}
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
