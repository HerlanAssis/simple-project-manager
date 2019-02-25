import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'

import { Route } from './components';

import {
  Login,
  Dashboard,
} from './pages';


class App extends Component {

  render() {
    return (
      <Router>
        <Switch>
          <Route.Custom exact={true} path="/login" component={Login} />
          <Route.Custom path="/" component={Dashboard} />
        </Switch>
      </Router>
    );
  }
}

export default App;
