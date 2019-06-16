import React, { Fragment, Component } from 'react'

import { Modal, Button, Image, Grid, Segment, Rail, List } from 'semantic-ui-react'

import Header from './header'
import Menu from './menu'
import Page from './page'

import logo from '~/assets/img/ECMWF_logo.png'

class App extends Component {
  getApp = fromScratch => (
    <Fragment>
      <Header />
      <Menu />
      <Page />
    </Fragment>
  )

  getSpashIntro = () => (
    <Fragment>
      <h3>Welcome to ecPoint-PyCal</h3>

      <br />
      <br />
      <br />

      <p>
        ecPoint-PyCal is a software that compares numerical model outputs against point
        observations to identify biases/errors at local scale. It provides a dynamic
        environment to post-process model parameters to produce probabilistic products
        for geographical locations.
      </p>
    </Fragment>
  )

  getSplashFooter = () => <Image src={logo} size="small" className="splash-footer" />

  getSunFlareBack = () => (
    <svg id="back">
      <radialGradient
        id="SVGID_1_"
        cx="0"
        cy="0"
        r="320.8304"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" style={{ stopColor: '#FFDE17', stopOpacity: 0.7 }} />
        <stop offset="1" style={{ stopColor: '#FFF200', stopOpacity: 0 }} />
      </radialGradient>
      <path
        id="sunburst"
        style={{ fill: 'url(#SVGID_1_)' }}
        d="M0,319.7c-18.6,0-37.3-1.6-55.5-4.8L-7.8,41.4c5.1,0.9,10.6,0.9,15.7,0L56,314.8C37.6,318,18.8,319.7,0,319.7z
            M-160.8,276.6c-32.5-18.8-61.3-42.9-85.5-71.6L-34,26.2c3.4,4.1,7.4,7.4,12,10.1L-160.8,276.6z M161.3,276.4L22.1,36.2
            c4.5-2.6,8.6-6,12-10.1l212.6,178.5C222.5,233.4,193.8,257.6,161.3,276.4z M-302.5,108.3C-315.4,73-321.9,36-322-1.8l277.6-0.5
            c0,5.3,0.9,10.4,2.7,15.2L-302.5,108.3z M302.6,107.8L41.8,12.8c1.7-4.7,2.6-9.7,2.6-14.9c0-0.3,0-0.6,0-1H322l0-1.3l0,1.9
            C322,35.4,315.5,72.5,302.6,107.8z M-41.8-17.5l-261-94.5c12.8-35.4,31.6-68,55.8-96.9L-34.1-30.8C-37.5-26.8-40.1-22.3-41.8-17.5z
            M41.7-17.7c-1.8-4.8-4.4-9.3-7.8-13.3l212-179.2c24.3,28.8,43.3,61.3,56.3,96.6L41.7-17.7z M-22.2-40.8l-139.6-240
            c32.7-19,68.1-32,105.2-38.6L-8-46.1C-13-45.2-17.8-43.4-22.2-40.8z M22-40.9c-4.4-2.6-9.2-4.3-14.2-5.1l47.1-273.6
            c37.2,6.4,72.7,19.2,105.4,38L22-40.9z"
      />
    </svg>
  )

  getAnimationsOutsideCard = () => <svg id="outer" />

  getCTA = () => (
    <div id="cta">
      <Grid centered>
        <Grid.Row>
          <Button
            positive
            icon="edit outline"
            labelPosition="right"
            content="Start from scratch"
            onClick={() => this.props.setScratchValue(true)}
          />
        </Grid.Row>
        <Grid.Row>
          <Button
            color="black"
            icon="cloud upload"
            labelPosition="right"
            content="Load a pre-computed ascii table"
            onClick={() => this.props.setScratchValue(false)}
          />
        </Grid.Row>
      </Grid>
    </div>
  )

  getSplashResources = () => (
    <Fragment>
      <br />
      <br />
      <br />
      <br />
      <h4>Resources</h4>

      <List as="ul">
        <List.Item as="li">Guide</List.Item>
        <List.Item as="li">Publication</List.Item>
        <List.Item as="li">GitHub</List.Item>
      </List>
    </Fragment>
  )

  getSplashCard = () => (
    <div id="card" className="weather">
      <svg id="inner">
        <defs>
          <path
            id="leaf"
            d="M41.9,56.3l0.1-2.5c0,0,4.6-1.2,5.6-2.2c1-1,3.6-13,12-15.6c9.7-3.1,19.9-2,26.1-2.1c2.7,0-10,23.9-20.5,25 c-7.5,0.8-17.2-5.1-17.2-5.1L41.9,56.3z"
          />
        </defs>
        <circle id="sun" style={{ fill: '#F7ED47' }} cx="0" cy="0" r="50" />
        <g id="layer3" />
        <g id="cloud3" className="cloud" />
        <g id="layer2" />
        <g id="cloud2" className="cloud" />
        <g id="layer1" />
        <g id="cloud1" className="cloud" />
      </svg>
      <div className="details">
        <div className="temp" />
        <div className="right">
          <div id="date">v{this.getAppVersion()}</div>
          <div id="summary">ecPoint-PyCal</div>
        </div>
      </div>
    </div>
  )

  getAppVersion = () => window.require('electron').remote.app.getVersion()

  getSplashScreen = () => (
    <Fragment>
      {this.getSunFlareBack()}
      {this.getAnimationsOutsideCard()}
      <div className="background">
        <div className="splashContainer">
          <Grid centered>
            <Grid.Column>
              {this.getSplashCard()}

              <Rail position="left">{this.getSpashIntro()}</Rail>

              <Rail position="right">{this.getSplashResources()}</Rail>
            </Grid.Column>
          </Grid>
          {this.getCTA()}
        </div>
      </div>
      {this.getSplashFooter()}
    </Fragment>
  )

  render = () =>
    this.props.app.scratch === null ? this.getSplashScreen() : this.getApp()
}

export default App
