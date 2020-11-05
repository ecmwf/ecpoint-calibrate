import React, { Component } from 'react'

import { Grid, Card, Radio, Item, Icon } from 'semantic-ui-react'

class Cheaper extends Component {
  getField = () => (
    <Item>
      <Item.Content>
        <Item.Description>
          <p>
            Use a decision-tree algorithm that is optimized for memory usage over
            performance. Useful for post-processing very large point data files.
          </p>
          <Radio
            toggle
            onChange={() => this.props.onCheaperChange(!this.props.cheaper)}
          />
        </Item.Description>
      </Item.Content>
    </Item>
  )

  render = () => (
    <>
      <Grid container centered>
        <Grid.Column>
          <Card fluid color="black">
            <Card.Header>
              <Grid.Column floated="left">Enable Cheaper mode</Grid.Column>
              <Grid.Column floated="right">
                <Icon name="check circle" />
              </Grid.Column>
            </Card.Header>
            <Card.Content>
              <Card.Description />
              <Item.Group divided>{this.getField()}</Item.Group>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    </>
  )
}

export default Cheaper
