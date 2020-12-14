import React, { Component } from 'react'

import { Grid, Card, Table, Icon } from 'semantic-ui-react'

import _ from 'lodash'

class Summary extends Component {
  render = () =>
    !!this.props.summary && (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="black">
            <Card.Header>
              <Grid.Column floated="left">Point Data Table - Summary</Grid.Column>
              <Grid.Column floated="right">
                <Icon name="check circle" />
              </Grid.Column>
            </Card.Header>
            <Card.Content>
              <Card.Description />
              <Table definition>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell>Min</Table.HeaderCell>
                    <Table.HeaderCell>Max</Table.HeaderCell>
                    <Table.HeaderCell>Mean</Table.HeaderCell>
                    <Table.HeaderCell>Median</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {this.props.summary.map(item => (
                    <Table.Row>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.min}</Table.Cell>
                      <Table.Cell>{item.max}</Table.Cell>
                      <Table.Cell>{item.mean}</Table.Cell>
                      <Table.Cell>{item.median}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
                <Table.Footer fullWidth>
                  <Table.Row>
                    <Table.HeaderCell />
                    <Table.HeaderCell colSpan="4">
                      <b>Number of rows:</b> {this.props.count}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Footer>
              </Table>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
}

export default Summary
