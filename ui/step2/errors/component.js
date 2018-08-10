import React, { Component, Fragment } from 'react'

import {
  Grid,
  Card,
  Checkbox,
  Input
} from 'semantic-ui-react'

import { isEmpty } from './index'

class Errors extends Component {
  minValueField = () =>
    <Fragment>
      <Grid.Row>
        <Input
          error={this.minValueHasError()}
          placeholder='Enter number'
          value={this.props.errors.minValueFER}
          onChange={e =>
            this.props.changeMinValueFER(e.target.value)
          }
        />
      </Grid.Row>
      <Grid.Row>
          Select a minimum value to consider, so as to not divide by zero. Pay
          attention to the ensure consistency with chosen units.
      </Grid.Row>
    </Fragment>

  minValueHasError = () =>
    this.props.errors.minValueFER === '' ||
    /^\d$/.test(this.props.errors.minValueFER)
      ? null
      : true

  hasError = () => !!this.minValueHasError()

  isComplete = () => !this.hasError() && isEmpty(this.props.errors)

  componentDidUpdate = (prevProps) => {
    this.props.updatePageCompletion(1, this.isComplete())
  }

  render = () =>
    <Grid container centered>
      <Grid.Column>
        <Card fluid color='teal'>
          <Card.Header>Predictant Errors</Card.Header>
          <Card.Content>
            <Card.Description>
                Select error(s) to compute:
            </Card.Description>
            <br />
            <Grid.Row>
              <Checkbox
                label='Forecast Error (FE)'
                defaultChecked={this.props.errors.isFEChecked ? true : null}
                onChange={() => this.props.toggleFE()}
              />
            </Grid.Row>
            <Grid.Row>
              <Checkbox
                label='Forecast Error Ratio (FER)'
                defaultChecked={this.props.errors.isFERChecked ? true : null}
                onChange={() => this.props.toggleFER()}
              />
              {this.props.errors.isFERChecked && this.minValueField()}
            </Grid.Row>
          </Card.Content>
        </Card>
      </Grid.Column>
    </Grid>
}

export default Errors
