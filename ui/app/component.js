import React, { Component } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Button, Image, Grid, Icon, Popup } from 'semantic-ui-react'

import Header from './header'
import Page from './page'
import ring from '~/assets/img/ring.png'

const { shell } = require('electron')

function Content({ children }) {
  return <div style={{ paddingTop: '52px', height: '100%' }}>{children}</div>
}

class App extends Component {
  getApp = () => [
    <Page />,
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />,
  ]

  getSpashIntro = () => <Image src={ring} size="big" verticalAlign="middle" />

  getSplashRightGrid = () => (
    <Grid padded="horizontally">
      <Grid.Row centered columns={1}>
        <Popup
          trigger={
            <Button
              color="black"
              icon="edit outline"
              labelPosition="right"
              onClick={() => this.props.setWorkflow('B')}
              size="big"
              fluid
            >
              Generate a New <br /> Point Data Table
              <Icon name="edit outline" />
            </Button>
          }
          position="left center"
          wide
        >
          Generate a new data table containing the modelled and observed values of the
          considered predictand, and all the chosen predictors, for every instance
          evaluated in the calibration period.
        </Popup>
      </Grid.Row>

      <Grid.Row centered columns={1}>
        <Popup
          trigger={
            <Button
              color="black"
              icon="lab"
              labelPosition="right"
              size="big"
              onClick={() => this.props.setWorkflow('C')}
              fluid
            >
              Create / test <br />
              Decision Tree
              <Icon name="tree" />
            </Button>
          }
          position="bottom left"
          wide
        >
          <ul>
            <li>
              Test a pre-existing decision tree on (different) data contained in an
              uploaded data table. A priori the user knows the structure of the decision
              tree (or possible wants to directly test a modified version thereof). The
              user will be asked to specify directly the predictor hierarchy and the
              breakpoints for each predictor.
            </li>
            <li>
              Construct a new decision tree, based on the contents of the data table. It
              will be built iteratively by the user, by providing them with the output
              of statistical tests that show whether or not potential adjacent
              branches/leaves are significantly different from one another.
            </li>

            <li>
              Use conditional verification tools to compare NWP model output with point
              observations. This will analyse whether or not the considered predictand
              is influenced by the chosen predictors.
            </li>
          </ul>
        </Popup>
      </Grid.Row>

      <Grid.Row centered columns={3}>
        <Grid.Column textAlign="left">
          <Button
            color="facebook"
            onClick={() => shell.openExternal('https://facebook.com/ESoWC')}
          >
            <Icon name="facebook" />
            Facebook
          </Button>
          <b>fb.com/ESoWC</b>
        </Grid.Column>

        <Grid.Column textAlign="center">
          <Button
            color="twitter"
            onClick={() => shell.openExternal('https://twitter.com/esowc_ecmwf')}
          >
            <Icon name="twitter" />
            Twitter
          </Button>
          <b>@esowc_ecmwf</b>
        </Grid.Column>
        <Grid.Column textAlign="right">
          <Button
            color="github"
            onClick={() =>
              shell.openExternal('https://github.com/esowc/ecPoint-Calibrate')
            }
          >
            <Icon name="github" />
            GitHub
          </Button>
          <b>esowc/ecPoint-Calibrate</b>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )

  getSplashScreen = () => (
    <Grid columns={2} padded="vertically" className="background">
      <Grid.Row>
        <Grid.Column textAlign="center" verticalAlign="middle">
          {this.getSpashIntro()}
        </Grid.Column>
        <Grid.Column
          textAlign="center"
          verticalAlign="middle"
          className="right-splash-grid"
        >
          {this.getSplashRightGrid()}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )

  render() {
    return (
      <>
        <Header />
        <Content>
          {this.props.workflow === null ? this.getSplashScreen() : this.getApp()}
        </Content>
      </>
    )
  }
}

export default App
