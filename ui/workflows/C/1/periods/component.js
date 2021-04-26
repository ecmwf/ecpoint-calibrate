import React, { Component } from 'react'

import { Grid, Card, Table, Icon, Checkbox, Input } from 'semantic-ui-react'

import _ from 'lodash'

import { realNumbers } from '~/utils/patterns'

const getPeriod = range =>
  _.subtract(..._.reverse(range.map(v => (realNumbers.test(v) ? parseFloat(v) : 0))))

class Periods extends Component {
  rangeHasError = range => {
    const [lower, upper] = range
    let [lowerHasError, upperHasError] = [false, false]

    if (lower !== '-inf' && lower !== null && !realNumbers.test(lower)) {
      lowerHasError = true
    }

    if (upper !== 'inf' && upper !== null && !realNumbers.test(upper)) {
      upperHasError = true
    }

    if (
      !lowerHasError &&
      !upperHasError &&
      lower !== '-inf' &&
      upper !== 'inf' &&
      parseFloat(upper) <= parseFloat(lower)
    ) {
      return [true, true]
    }

    return [lowerHasError, upperHasError]
  }

  render = () => {
    return (
      this.props.ranges !== null && (
        <Grid container centered>
          <Grid.Column>
            <Card fluid color="black">
              <Card.Header>
                <Grid.Column floated="left">Predictor Ranges</Grid.Column>
                <Grid.Column floated="right">
                  <Icon name="check circle" />
                </Grid.Column>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  <p>
                    Enter the lower and upper bound for circular/periodic predictors.
                    Leave the input fields unchanged (-inf and inf) for non-periodic
                    predictors.
                  </p>
                  <br />
                  <p>Values are considered valid if:</p>
                  <ul>
                    <li>they are real numbers or -inf/inf.</li>
                    <li>lower bound is less than upper bound.</li>
                  </ul>
                </Card.Description>
                <Table celled compact definition>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Circular?</Table.HeaderCell>
                      <Table.HeaderCell>Predictor</Table.HeaderCell>
                      <Table.HeaderCell>Units</Table.HeaderCell>
                      <Table.HeaderCell>Range</Table.HeaderCell>
                      <Table.HeaderCell>Period</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {Object.keys(this.props.ranges).map(predictor => (
                      <Table.Row>
                        <Table.Cell collapsing>
                          <Checkbox
                            checked={
                              !_.includes(this.props.ranges[predictor], 'inf') &&
                              !_.includes(this.props.ranges[predictor], '-inf')
                            }
                            disabled={true}
                          />
                        </Table.Cell>
                        <Table.Cell>{predictor}</Table.Cell>
                        <Table.Cell>{this.props.units[predictor]}</Table.Cell>
                        <Table.Cell>
                          <Input
                            label="lower"
                            value={this.props.ranges[predictor][0]}
                            onChange={e =>
                              this.props.setPeriod(predictor, [
                                e.target.value || null,
                                undefined,
                              ])
                            }
                            error={this.rangeHasError(this.props.ranges[predictor])[0]}
                            placeholder="Enter lower bound..."
                          />
                          &nbsp;&nbsp;&nbsp;
                          <Input
                            label="upper"
                            value={this.props.ranges[predictor][1]}
                            onChange={e =>
                              this.props.setPeriod(predictor, [
                                undefined,
                                e.target.value || null,
                              ])
                            }
                            error={this.rangeHasError(this.props.ranges[predictor])[1]}
                            placeholder="Enter upper bound..."
                          />
                        </Table.Cell>
                        <Table.Cell>
                          {!_.includes(this.props.ranges[predictor], 'inf') &&
                          !_.includes(this.props.ranges[predictor], '-inf')
                            ? getPeriod(this.props.ranges[predictor])
                            : '-'}
                        </Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      )
    )
  }
}

export default Periods
