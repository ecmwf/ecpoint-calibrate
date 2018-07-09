import React, { Component } from 'react'
import { remote } from 'electron'

import {
  Grid,
  Card,
  Button,
  Checkbox,
  Icon,
  Table,
  Dropdown,
  Input,
  Label,
  Radio,
  Item,
} from 'semantic-ui-react'

const mainProcess = remote.require('./server')

class SelectPredictant extends Component {
  getPredictantField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>
            Select directory for the predictants you want to use (rainfall,
            temperature, etc.)
          </h5>
        </Item.Header>

        <Item.Description>
          <Button
            onClick={() =>
              this.props.onPredictantPathChange(mainProcess.selectDirectory())
            }
          >
            Browse
          </Button>
        </Item.Description>
        <Item.Extra>{this.props.predictant.predictantPath}</Item.Extra>
      </Item.Content>
    </Item>
  )

  getPredictorField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>
            Select directory for the predictors you want to use (CAPE, SR, etc.)
          </h5>
        </Item.Header>

        <Item.Description>
          <Button
            onClick={() =>
              this.props.onPredictorsPathChange(mainProcess.selectDirectory())
            }
          >
            Browse
          </Button>
        </Item.Description>
        <Item.Extra>{this.props.predictant.predictorsPath}</Item.Extra>
      </Item.Content>
    </Item>
  )

  getPredictantTypeField = () => (
    <Item>
      <Item.Content>
        <Item.Header>
          <h5>Select the data type you want to load:</h5>
        </Item.Header>

        <Item.Description>
          <Grid columns={2} padded>
            <Grid.Column>
              <Radio
                label="GRIB"
                value="grib"
                checked={this.props.predictant.type === 'grib'}
                onChange={() => this.props.onPredictantTypeChange('grib')}
              />
            </Grid.Column>
            <Grid.Column>
              <Radio
                label="NetCDF"
                value="netcdf"
                checked={this.props.predictant.type === 'netcdf'}
                onChange={() => this.props.onPredictantTypeChange('netcdf')}
              />
            </Grid.Column>
          </Grid>
        </Item.Description>
      </Item.Content>
    </Item>
  )

  render() {
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="teal">
            <Card.Header>Select Predictant</Card.Header>
            <Card.Content>
              <Card.Description />
              <Item.Group divided>
                {this.getPredictantField()}
                {this.getPredictorField()}
                {this.getPredictantTypeField()}
              </Item.Group>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default SelectPredictant
