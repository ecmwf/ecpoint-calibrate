import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import App from '../app'

const Root = () => (
  <Router>
    <Switch>
      <Route path="/" component={App} exact />
    </Switch>
  </Router>
)

export default Root
