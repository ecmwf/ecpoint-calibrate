import React, { Component, Fragment } from 'react'

import _ from 'lodash'

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
} from 'semantic-ui-react'

const friendOptions = [
  {
    text: 'Accumulated Field',
    value: 'ACCUMULATED_FIELD',
  },
  {
    text: 'Instantaneous Field',
    value: 'INSTANTANEOUS_FIELD',
  },
  {
    text: 'Maximum Field',
    value: 'MAXIMUM_FIELD',
  },
  {
    text: 'Minimum Field',
    value: 'MINIMUM_FIELD',
  },
  {
    text: 'Average Field',
    value: 'AVERAGE_FIELD',
  },
  {
    text: 'Weighted Field',
    value: 'WEIGHTED_FIELD',
  },
  {
    text: 'Vector Module',
    value: 'VECTOR_MODULE',
  },
]

const predictors = [
  { key: 'tp', text: 'tp', value: 'tp' },
  { key: 'cp', text: 'cp', value: 'cp' },
  { key: 'cape', text: 'cape', value: 'cape' },
  { key: 'u700', text: 'v700', value: 'v700' },
  { key: 'sr', text: 'sr', value: 'sr' },
]

class Computation extends Component {
  isPositive() {
    if (this.props.name && this.props.field && this.props.inputs.length !== 0) {
      return true
    }
    return null
  }
  render() {
    return (
      <Table.Row positive={this.isPositive()}>
        <Table.Cell>
          <Input
            fluid
            placeholder="Enter computation name"
            value={this.props.name}
            onChange={e =>
              this.props.onNameChange(this.props.index, e.target.value)
            }
          />
        </Table.Cell>
        <Table.Cell>
          <Dropdown
            placeholder="Select field"
            fluid
            selection
            options={friendOptions}
            value={this.props.field}
            onChange={(e, { value }) =>
              this.props.onFieldChange(this.props.index, value)
            }
          />
        </Table.Cell>
        <Table.Cell>
          <Dropdown
            fluid
            multiple
            selection
            placeholder="Select computation input(s)"
            value={this.props.inputs}
            options={predictors.concat(
              this.props.computedVariables
                .map(v => ({
                  key: v,
                  text: v,
                  value: v,
                }))
                .filter(v => v.key !== this.props.name)
            )}
            onChange={(e, { value }) =>
              this.props.onInputsChange(this.props.index, value)
            }
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Button
            icon
            circular
            onClick={() => this.props.onRemove(this.props.index)}
          >
            <Icon name="delete" />
          </Button>
        </Table.Cell>
      </Table.Row>
    )
  }
}

class Computations extends Component {
  getComputationsTable() {
    return (
      <Table celled definition>
        <Table.Header fullWidth>
          <Table.Row>
            <Table.HeaderCell>Computation</Table.HeaderCell>
            <Table.HeaderCell>Operation</Table.HeaderCell>
            <Table.HeaderCell>Input variable(s)</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.computations.map(each => (
            <Computation
              {...each}
              key={each.index}
              computedVariables={this.props.computations.map(
                computation => computation.name
              )}
              onNameChange={this.props.onComputationNameChange}
              onFieldChange={this.props.onComputationFieldChange}
              onInputsChange={this.props.onComputationInputsChange}
              onRemove={this.props.onComputationRemove}
            />
          ))}
        </Table.Body>

        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="4">
              <Button
                floated="right"
                icon
                labelPosition="left"
                primary
                size="small"
                onClick={() => this.props.addEmptyComputation()}
              >
                <Icon name="add circle" /> Add row
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )
  }

  render() {
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid>
            <Card.Content>
              <Card.Header>Computations</Card.Header>
              <Card.Meta>
                <span className="date">Joined in 2015</span>
              </Card.Meta>
              <Card.Description>
                <p>
                  Available predictors that can be used as inputs to
                  computations:
                </p>
                <Label>tp</Label>
                <Label>cp</Label>
                <Label>cape</Label>
                <Label>u700</Label>
                <Label>v700</Label>
                <Label>sr</Label>
              </Card.Description>

              {this.getComputationsTable()}
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name="cogs" />
                {this.props.computations.length} computation(s).
              </a>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Computations
