import React, { Component } from 'react'

import { Grid, Card, Table, Icon, Checkbox, Input } from 'semantic-ui-react'

import { realNumbers } from '~/utils/patterns'

class Periods extends Component {
  render = () =>
    this.props.periods !== null && (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="black">
            <Card.Header>
              <Grid.Column floated="left">Predictor Periods</Grid.Column>
              <Grid.Column floated="right">
                <Icon name="check circle" />
              </Grid.Column>
            </Card.Header>
            <Card.Content>
              <Card.Description>
                <p>
                  Enter the period for circular/periodic predictors. Leave the input
                  fields blank for non-periodic predictors.
                </p>
                <br />
                <p>Values must be real numbers to be considered valid.</p>
              </Card.Description>
              <Table celled compact definition>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Predictor</Table.HeaderCell>
                    <Table.HeaderCell>Period</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {Object.keys(this.props.periods).map(predictor => (
                    <Table.Row>
                      <Table.Cell collapsing>
                        <Checkbox
                          checked={this.props.periods[predictor] !== null}
                          disabled={true}
                        />
                      </Table.Cell>
                      <Table.Cell>{predictor}</Table.Cell>
                      <Table.Cell>
                        <Input
                          value={this.props.periods[predictor]}
                          onChange={e =>
                            this.props.setPeriod(predictor, e.target.value || null)
                          }
                          error={
                            this.props.periods[predictor] &&
                            !realNumbers.test(this.props.periods[predictor])
                          }
                          placeholder="Enter period value..."
                        />
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
}

export default Periods
