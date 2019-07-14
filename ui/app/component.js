import React, { Fragment, Component } from 'react'

import {
  Modal,
  Button,
  Image,
  Grid,
  Segment,
  Rail,
  List,
  Icon,
} from 'semantic-ui-react'

import Header from './header'
import Menu from './menu'
import Page from './page'

import ring from '~/assets/img/ring.png'

class App extends Component {
  getApp = fromScratch => (
    <Fragment>
      <Header />
      <Menu />
      <Page />
    </Fragment>
  )

  getSpashIntro = () => <Image src={ring} size="big" verticalAlign="middle" />

  getSplashRightGrid = () => (
    <Grid padded="horizontally">
      <Grid.Row centered columns={1}>
        <Button
          color="black"
          icon="cloud upload"
          labelPosition="right"
          content="Activate Data Analysis (Conditional Verification Toolbox)"
          size="big"
          fluid
        />
      </Grid.Row>

      <Grid.Row centered columns={2}>
        <Grid.Column verticalAlign="middle" className="cta-left">
          <Button
            color="black"
            icon="edit outline"
            labelPosition="right"
            content="Generate new Point Data Table"
            onClick={() => this.props.setScratchValue(true)}
            size="big"
            fluid
          />
        </Grid.Column>
        <Grid.Column verticalAlign="middle" className="cta-right">
          <Button
            color="black"
            icon="cloud upload"
            labelPosition="right"
            content="Upload existing Point Data Table"
            onClick={() => this.props.setScratchValue(false)}
            size="big"
            fluid
          />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row centered columns={2}>
        <Grid.Column verticalAlign="middle" className="cta-left">
          <Button
            color="black"
            icon="tree"
            labelPosition="right"
            content="Construct new Decision Tree"
            size="big"
            fluid
          />
        </Grid.Column>
        <Grid.Column verticalAlign="middle" className="cta-right">
          <Button
            color="black"
            icon="lab"
            labelPosition="right"
            content="Test existing Decision Tree"
            size="big"
            fluid
          />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row centered columns={3}>
        <Grid.Column textAlign="left">
          <Icon name="facebook" size="big" />
        </Grid.Column>

        <Grid.Column textAlign="center">
          <Icon name="twitter" size="big" />
        </Grid.Column>
        <Grid.Column textAlign="right">
          <Icon name="github" size="big" />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )

  getSplashScreen = () => (
    <Fragment>
      <Header />
      <Grid columns={2} padded="vertically" className="background">
        <Grid.Row>
          <Grid.Column textAlign="center" verticalAlign="middle">
            {this.getSpashIntro()}
          </Grid.Column>
          <Grid.Column textAlign="center" verticalAlign="middle">
            {this.getSplashRightGrid()}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Fragment>
  )

  render = () =>
    this.props.app.scratch === null ? this.getSplashScreen() : this.getApp()
}

export default App
