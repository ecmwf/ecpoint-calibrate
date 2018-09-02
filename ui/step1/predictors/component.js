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
          <h5>Select directory for the predictors you want to use (CAPE, SR, etc.)</h5>
        </Item.Header>

        <Item.Description>
          <Button
            onClick={() => this.props.onPathChange(mainProcess.selectDirectory())}
          >
            Browse
          </Button>
        </Item.Description>
        <Item.Extra>
          <p>{this.props.predictors.path}</p>
          {this.props.predictors.codes.map(code => (
            <Label key={code}>{code}</Label>
          ))}
        </Item.Extra>
      </Item.Content>
    </Item>
  )

  getTypeField = () => (
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
                checked={this.props.predictors.type === 'grib'}
                onChange={() => this.props.onTypeChange('grib')}
              />
            </Grid.Column>
            <Grid.Column>
              <Radio
                label="NetCDF"
                value="netcdf"
                checked={this.props.predictors.type === 'netcdf'}
                onChange={() => this.props.onTypeChange('netcdf')}
              />
            </Grid.Column>
          </Grid>
        </Item.Description>
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
              <Item.Group divided>
                {this.getField()}
                {this.getTypeField()}
              </Item.Group>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Predictors
