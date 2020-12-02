import React, { Component } from 'react'

import client from '~/utils/client'
import toast from '~/utils/toast'

import {
  Grid,
  Card,
  Button,
  Icon,
  Table,
  Dropdown,
  Input,
  Label,
  Checkbox,
  Message,
  Popup,
  Modal,
} from 'semantic-ui-react'

import { isNotEmpty, isValid, patterns } from './index'

const operations = type =>
  type === 'ACCUMULATED'
    ? [
        {
          text: 'Accumulated Field',
          value: 'ACCUMULATED_FIELD',
        },
        {
          text: 'Ratio Field',
          value: 'RATIO_FIELD',
        },
        {
          text: 'Instantaneous Field - Begin',
          value: 'INSTANTANEOUS_FIELD_100',
        },
        {
          text: 'Instantaneous Field - Middle',
          value: 'INSTANTANEOUS_FIELD_010',
        },
        {
          text: 'Instantaneous Field - End',
          value: 'INSTANTANEOUS_FIELD_001',
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
          text: 'Weighted Average Field',
          value: 'WEIGHTED_AVERAGE_FIELD',
        },
        {
          text: 'Vector Module',
          value: 'VECTOR_MODULE',
        },
        {
          text: '24h Solar Radiaton',
          value: '24H_SOLAR_RADIATION',
        },
        {
          text: 'Local Solar Time',
          value: 'LOCAL_SOLAR_TIME',
        },
      ]
    : [
        {
          text: 'Ratio Field',
          value: 'RATIO_FIELD',
        },
        {
          text: 'Instantaneous Field',
          value: 'INSTANTANEOUS_FIELD_100',
        },
        {
          text: 'Vector Module',
          value: 'VECTOR_MODULE',
        },
        {
          text: 'Local Solar Time',
          value: 'LOCAL_SOLAR_TIME',
        },
      ]

class Computation extends Component {
  isPositive = () =>
    isNotEmpty([this.props.fields[this.props.index]]) &&
    !this.unitsHasError() &&
    isValid([this.props.fields[this.props.index]])
      ? true
      : null

  getPredictors = () => {
    const canPrefillSolarRadiation =
      this.props.field === '24H_SOLAR_RADIATION' &&
      this.props.predictors.codes.includes('sr')

    return canPrefillSolarRadiation
      ? [{ key: 'sr', text: 'sr', value: 'sr' }]
      : this.props.predictors.codes
          .map(e => ({ key: e, text: e, value: e }))
          .concat(
            this.props.computedVariables
              .map(v => ({ key: v, text: v, value: v }))
              .filter(v => v.key !== this.props.shortname)
          )
  }

  unitsHasError = () =>
    this.props.index === 0
      ? this.props.units === this.props.observations.units
        ? null
        : 'Predictand variable units should match observation units.'
      : ['RATIO_FIELD', 'VECTOR_MODULE'].includes(this.props.field) &&
        new Set(this.props.inputs.map(i => i.units)).size > 1
      ? 'The units of the chosen variables should match.'
      : null

  updateInputs = value =>
    this.props.onInputsChange(
      this.props.index,
      value.map(input => ({
        code: input,
        name: this.props.computedVariables.includes(input)
          ? this.props.fields.filter(x => x.shortname === input)[0].fullname
          : null,
        units: this.props.computedVariables.includes(input)
          ? this.props.fields.filter(x => x.shortname === input)[0].units
          : null,
        path: this.props.predictors.path + '/' + input,
      })),
      this.props.overrides
    )

  render() {
    return (
      <Table.Row positive={this.isPositive()}>
        <Table.Cell width={4}>
          {this.props.index === 0 && (
            <Label ribbon>Predictand variable (pre-computed)</Label>
          )}
          <p>Short name:</p>
          <Input
            fluid
            placeholder="Enter short name"
            value={this.props.shortname}
            onChange={e =>
              this.props.onShortNameChange(this.props.index, e.target.value)
            }
            error={this.props.predictors.codes.includes(this.props.shortname)}
          />
          <br />
          <p>Full name:</p>
          <Input
            fluid
            placeholder="Enter full name"
            value={this.props.fullname}
            onChange={e =>
              this.props.onFullNameChange(this.props.index, e.target.value)
            }
          />
        </Table.Cell>
        <Table.Cell width={4}>
          <Dropdown
            placeholder="Select field type"
            fluid
            selection
            options={operations(this.props.predictand.type)}
            value={this.props.field}
            onChange={(e, { value }) =>
              this.props.onFieldChange(this.props.index, value)
            }
            disabled={this.props.index === 0 ? true : null}
          />
        </Table.Cell>
        <Table.Cell width={4}>
          <Dropdown
            fluid
            multiple
            selection
            placeholder="Select computation input(s)"
            value={this.props.inputs.map(input => input.code)}
            options={this.getPredictors()}
            onChange={(e, { value }) => this.updateInputs(value)}
            disabled={
              this.props.index === 0 || this.props.field === 'LOCAL_SOLAR_TIME'
                ? true
                : null
            }
          />

          {this.props.inputs.length > 0 && (
            <Table size="small" compact="very" basic="very">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell />
                  <Table.HeaderCell textAlign="center">
                    <b>Name</b>
                  </Table.HeaderCell>
                  <Table.HeaderCell textAlign="center">
                    <b>Units</b>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.props.inputs.map((input, key) => (
                  <Table.Row textAlign="center" key={key}>
                    <Table.Cell collapsing>{input.code}</Table.Cell>
                    <Table.Cell collapsing>{input.name}</Table.Cell>
                    <Table.Cell collapsing>{input.units}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          )}
          {this.unitsHasError() !== null && (
            <Message size="mini" negative>
              {this.unitsHasError()}
            </Message>
          )}
        </Table.Cell>

        <Table.Cell collapsing>
          <Grid.Row>
            <p>
              <b>Multiplying Factor:</b>
            </p>
            <Input
              fluid
              value={this.props.mulScale}
              error={!patterns.mulScale.test(this.props.mulScale)}
              onChange={e =>
                this.props.setMulScaleValue(this.props.index, e.target.value)
              }
              disabled={['24H_SOLAR_RADIATION', 'LOCAL_SOLAR_TIME'].includes(
                this.props.field
              )}
            />
          </Grid.Row>
          <Grid.Row>
            <p>
              <b>Value to Add:</b>
            </p>
            <Input
              fluid
              value={this.props.addScale}
              error={!patterns.addScale.test(this.props.addScale)}
              onChange={e =>
                this.props.setAddScaleValue(this.props.index, e.target.value)
              }
              disabled={['24H_SOLAR_RADIATION'].includes(this.props.field)}
            />
          </Grid.Row>
          <br />
          <b>
            Units:
            {this.props.field === '24H_SOLAR_RADIATION' && (
              <Popup trigger={<Icon name="info circle" />} size="tiny">
                The raw solar radiation has a unit of <code>J m**-2</code>, which means{' '}
                <code>W s m**-2</code>.<br />
                <br />
                When the solar radiation gets accumulated in 24h, it is necessary to
                divide by <code>24h</code>
                (or <code>86400s</code>
                ).
                <br />
                <br />
                Thus, the units of this field becomes <code>W m**-2</code>.
              </Popup>
            )}
          </b>

          <Input
            fluid
            error={this.unitsHasError() !== null}
            value={this.props.units}
            onChange={e => this.props.updateUnits(this.props.index, e.target.value)}
            disabled={this.props.mulScale === '1' && this.props.addScale === '0'}
          />
        </Table.Cell>
        <Table.Cell collapsing textAlign="center">
          <Checkbox
            checked={this.props.isPostProcessed === true}
            onChange={() => this.props.togglePostProcess(this.props.index)}
            disabled={this.props.index === 0 ? true : null}
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Button
            icon
            circular
            onClick={() => this.props.onRemove(this.props.index)}
            disabled={this.props.index === 0 ? true : null}
          >
            <Icon name="delete" />
          </Button>
        </Table.Cell>
      </Table.Row>
    )
  }
}

class Computations extends Component {
  state = { showOverride: false, overrides: {} }

  getComputationsTable() {
    return (
      <Table celled definition>
        <Table.Header fullWidth>
          <Table.Row>
            <Table.HeaderCell textAlign="center">Field name</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Field type</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Input variable(s)</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Scaling factor</Table.HeaderCell>
            <Table.HeaderCell textAlign="center">Predictor?</Table.HeaderCell>
            <Table.HeaderCell />
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.props.fields.map(each => (
            <Computation
              {...each}
              key={each.index}
              fields={this.props.fields}
              overrides={this.state.overrides}
              computedVariables={this.props.fields.map(field => field.shortname)}
              onShortNameChange={this.props.onComputationShortNameChange}
              onFullNameChange={this.props.onComputationFullNameChange}
              onFieldChange={this.props.onComputationFieldChange}
              onInputsChange={this.props.onComputationInputsChange}
              onRemove={this.props.onComputationRemove}
              setScaleOp={this.props.setScaleOp}
              setMulScaleValue={this.props.setMulScaleValue}
              setAddScaleValue={this.props.setAddScaleValue}
              predictors={this.props.predictors}
              predictand={this.props.predictand}
              observations={this.props.observations}
              togglePostProcess={this.props.toggleComputationPostProcess}
              updateUnits={this.props.updateUnits}
            />
          ))}
        </Table.Body>

        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell />
            <Table.HeaderCell colSpan="6">
              <Button
                floated="right"
                icon
                labelPosition="left"
                primary
                size="small"
                onClick={() => this.addComputation()}
              >
                <Icon name="add circle" /> Add row
              </Button>
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    )
  }

  hasError = () => false

  isComplete = () => !this.hasError() && isValid(this.props.fields)

  componentDidUpdate = prevProps => {
    this.isComplete() && this.props.completeSection()
  }

  constructor(props) {
    super(props)

    this.props.predictors.codes.map(code => this.populateInputMetadata(code))
    this.props.fields.length === 0 && this.addComputation()
  }

  populateInputMetadata = code => {
    client
      .post('/get-predictor-metadata', {
        path: this.props.predictors.path + '/' + code,
      })
      .then(response =>
        this.setState({
          overrides: {
            [code]: { code, ...response.data },
            ...this.state.overrides,
          },
        })
      )
      .catch(e => {
        console.error(e)
        if (e.response !== undefined) {
          console.error(`Error response: ${e.response}`)
          toast.error(`${e.response.status} ${e.response.statusText}`)
        } else {
          toast.error('Empty response from server')
        }
      })
  }

  addComputation = () => {
    const input = {
      code: this.props.predictand.code,
      path: this.props.predictors.path + '/' + this.props.predictand.code,
    }
    this.props.addComputation({
      shortname: this.props.predictand.code.toUpperCase(),
      fullname: this.props.predictand.code.toUpperCase(),
      field:
        this.props.predictand.type === 'ACCUMULATED'
          ? 'ACCUMULATED_FIELD'
          : 'INSTANTANEOUS_FIELD_100',
      inputs: [input],
      mulScale: '1',
      addScale: '0',
    })

    this.props.fetchAndUpdateInputUnits(
      this.props.fields.length,
      input,
      this.state.overrides
    )
  }

  getHeadline = () => {
    return (
      <>
        <p>Variables available for computing predictors:</p>
        {this.props.predictors.codes.map(e => (
          <Label key={e}>{e}</Label>
        ))}

        <Button
          size="mini"
          floated="right"
          onClick={() => this.setState({ showOverride: true })}
        >
          Override predictor metadata
        </Button>
      </>
    )
  }

  getOverrideModal = () => {
    return (
      <Modal
        size={'large'}
        open={this.state.showOverride === true}
        onClose={() => this.setState({ showOverride: false })}
      >
        <Modal.Header>Override metadata of predictors</Modal.Header>
        <Modal.Content>
          <Table size="small" compact="very" basic="very">
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell textAlign="left">
                  <b>Variable</b>
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="left">
                  <b>Name</b>
                </Table.HeaderCell>
                <Table.HeaderCell textAlign="left">
                  <b>Units</b>
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.props.predictors.codes.map(
                code =>
                  this.state.overrides[code] !== undefined && (
                    <Table.Row key={code}>
                      <Table.Cell>
                        <Input
                          fluid
                          value={this.state.overrides[code].code}
                          error={this.state.overrides[code].code === ''}
                          disabled={true} // enabling this has consequences
                          onChange={e =>
                            this.setState({
                              overrides: {
                                ...this.state.overrides,
                                [code]: {
                                  ...this.state.overrides[code],
                                  code: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          fluid
                          value={this.state.overrides[code].name}
                          error={this.state.overrides[code].name === ''}
                          onChange={e =>
                            this.setState({
                              overrides: {
                                ...this.state.overrides,
                                [code]: {
                                  ...this.state.overrides[code],
                                  name: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <Input
                          fluid
                          value={this.state.overrides[code].units}
                          error={this.state.overrides[code].units === ''}
                          onChange={e =>
                            this.setState({
                              overrides: {
                                ...this.state.overrides,
                                [code]: {
                                  ...this.state.overrides[code],
                                  units: e.target.value,
                                },
                              },
                            })
                          }
                        />
                      </Table.Cell>
                    </Table.Row>
                  )
              )}
            </Table.Body>
          </Table>
        </Modal.Content>
      </Modal>
    )
  }

  render() {
    console.log(this.state.overrides)
    return (
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="black">
            <Card.Header>
              <Grid.Column floated="left">Computations (Define Predictors)</Grid.Column>
              <Grid.Column floated="right">
                {this.isComplete() && <Icon name="check circle" />}
              </Grid.Column>
            </Card.Header>
            <Card.Content>
              <Card.Description>
                {this.getHeadline()}
                {this.getOverrideModal()}
                {this.getComputationsTable()}
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <a>
                <Icon name="cogs" />
                {this.props.fields.length} computation(s);{' '}
                {this.props.fields.filter(field => field.isPostProcessed).length}{' '}
                variable(s) chosen as predictor(s).
              </a>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    )
  }
}

export default Computations
