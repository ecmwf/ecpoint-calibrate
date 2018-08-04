import React, { Component } from 'react'

import {
  Grid,
  Card,
  Button,
  Icon,
  Table,
  Dropdown,
  Input,
  Label,
  Radio
} from 'semantic-ui-react'

const operations = [
  {
    text: 'Accumulated Field',
    value: 'ACCUMULATED_FIELD'
  },
  {
    text: 'Instantaneous Field',
    value: 'INSTANTANEOUS_FIELD'
  },
  {
    text: 'Maximum Field',
    value: 'MAXIMUM_FIELD'
  },
  {
    text: 'Minimum Field',
    value: 'MINIMUM_FIELD'
  },
  {
    text: 'Average Field',
    value: 'AVERAGE_FIELD'
  },
  {
    text: 'Weighted Field',
    value: 'WEIGHTED_FIELD'
  },
  {
    text: 'Vector Module',
    value: 'VECTOR_MODULE'
  }
]

class Computation extends Component {
  isPositive () {
    if (
      this.props.name &&
      this.props.field &&
      this.props.scale.value &&
      this.props.inputs.length !== 0
    ) {
      return true
    }
    return null
  }

  getPredictors = () =>
    this.props.predictors
      .map(e => ({ key: e, text: e, value: e }))
      .concat(
        this.props.computedVariables
          .map(v => ({ key: v, text: v, value: v }))
          .filter(v => v.key !== this.props.name)
      )

  render () {
    return (
      <Table.Row positive={this.isPositive()}>
        <Table.Cell>
          <Input
            fluid
            placeholder='Enter computation name'
            value={this.props.name}
            onChange={e =>
              this.props.onNameChange(this.props.index, e.target.value)
            }
          />
        </Table.Cell>
        <Table.Cell>
          <Dropdown
            placeholder='Select field'
            fluid
            selection
            options={operations}
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
            placeholder='Select computation input(s)'
            value={this.props.inputs}
            options={this.getPredictors()}
            onChange={(e, { value }) =>
              this.props.onInputsChange(this.props.index, value)
            }
          />
        </Table.Cell>
        <Table.Cell>
          <Grid.Row>
            <Radio
              label='Multiply'
              value='MULTIPLY'
              checked={this.props.scale.op === 'MULTIPLY'}
              onChange={() =>
                this.props.setScaleOp(this.props.index, 'MULTIPLY')
              }
            />
          </Grid.Row>
          <Grid.Row>
            <Radio
              label='Divide'
              value='DIVIDE'
              checked={this.props.scale.op === 'DIVIDE'}
              onChange={() =>
                this.props.setScaleOp(this.props.index, 'DIVIDE')
              }
            />
          </Grid.Row>
          <Input
            fluid
            value={this.props.scale.value}
            onChange={e =>
              this.props.setScaleValue(this.props.index, e.target.value)
            }
          />
        </Table.Cell>
        <Table.Cell textAlign='center'>
          <Radio
            checked={this.props.isReference === true}
            onChange={() =>
              this.props.setReference(this.props.index)
            }
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Button
            icon
            circular
            onClick={() => this.props.onRemove(this.props.index)}
          >
            <Icon name='delete' />
          </Button>
        </Table.Cell>
      </Table.Row>
    )
  }
}

class Computations extends Component {
  getComputationsTable () {
    return (
      <Table celled definition>
        <Table.Header fullWidth>
          <Table.Row>
            <Table.HeaderCell textAlign='center'>Computation</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Operation</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Input variable(s)</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Scaling factor</Table.HeaderCell>
            <Table.HeaderCell textAlign='center'>Reference</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.fields.map(each => (
            <Computation
              {...each}
              key={each.index}
              computedVariables={this.props.fields.map(field => field.name)}
              onNameChange={this.props.onComputationNameChange}
              onFieldChange={this.props.onComputationFieldChange}
              onInputsChange={this.props.onComputationInputsChange}
              onRemove={this.props.onComputationRemove}
              setScaleOp={this.props.setScaleOp}
              setScaleValue={this.props.setScaleValue}
              predictors={this.props.database.predictorCodes}
              setReference={this.props.setComputationReference}
            />
          ))}
        </Table.Body>

        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan='4'>
              <Button
                floated='right'
                icon
                labelPosition='left'
                primary
                size='small'
                onClick={() => this.props.addEmptyComputation()}
              >
                <Icon name='add circle' /> Add row
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )
  }

  render () {
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color='teal'>
            <Card.Header>Computations</Card.Header>
            <Card.Content>
              <Card.Description>
                <p>
                  Available predictors that can be used as inputs to
                  computations:
                </p>
                {this.props.database.predictorCodes.map(e => <Label key={e}>{e}</Label>)}
                {this.getComputationsTable()}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name='cogs' />
                {this.props.fields.length} computation(s).
              </a>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Computations
