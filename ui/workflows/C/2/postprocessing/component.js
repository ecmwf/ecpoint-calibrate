import React, { Component } from 'react'

import { Grid, Card, Icon, Item, Input, Dimmer, Loader } from 'semantic-ui-react'

import BreakPoints from '../breakpoints'
import SparseBreakPoints from '../sparseBreakpoints'
import Tree from '../tree'
import Levels from '../levels'
import SaveOperation from '../saveOperation'

class PostProcessing extends Component {
  isComplete = () => true

  yLimHasError = () =>
    this.props.yLim === '' || /^\d+$/.test(this.props.yLim)
      ? parseInt(this.props.yLim) > 0 && parseInt(this.props.yLim) <= 100
        ? null
        : true
      : true

  getYLimitField = () =>
    this.props.thrGridOut.length > 0 && (
      <Item>
        <Item.Content>
          <Item.Header>
            <h5>Enter maximum value of Y-axis in the histograms:</h5>
          </Item.Header>
          <Item.Description>
            <Input
              value={this.props.yLim || ''}
              error={this.yLimHasError()}
              onChange={e => this.props.onYLimChange(e.target.value)}
            />
          </Item.Description>
          <Item.Extra>
            Valid values are all floating-point numbers in the set <code>(0, 100]</code>
            .
          </Item.Extra>
        </Item.Content>
      </Item>
    )

  getDecisionTree = () => (
    <Item>
      <Item.Content>
        <br />
        {!this.yLimHasError() && this.props.tree !== null && <Tree />}
      </Item.Content>
    </Item>
  )

  getSaveOperation = () => <SaveOperation />

  render = () => {
    return (
      this.props.fields.length > 0 && (
        <Grid padded>
          <Grid.Column>
            <Card fluid color="black">
              <Card.Header>
                <Grid.Column floated="left">Decision Tree</Grid.Column>
                <Grid.Column floated="right">
                  {this.isComplete() && <Icon name="check circle" />}
                </Grid.Column>
              </Card.Header>
              <Card.Content>
                <Card.Description>
                  <Item.Group divided>
                    <Dimmer active={!!this.props.loading}>
                      <Loader indeterminate>{this.props.loading}</Loader>
                    </Dimmer>
                    <Levels />
                    <SparseBreakPoints />
                    <BreakPoints />

                    {/* Hide tree until loading is finished for better experience */}
                    {!this.props.loading && (
                      <>
                        {this.getYLimitField()}
                        {this.getDecisionTree()}
                        {this.getSaveOperation()}
                      </>
                    )}
                  </Item.Group>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
        </Grid>
      )
    )
  }
}

export default PostProcessing
