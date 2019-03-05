import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'
import { Route } from './components';
import LocaleProvider from './l18n';


import {
  Login,
  Dashboard,
} from './pages';

class App extends Component {

  render() {
    return (
      <LocaleProvider>
        <Router>
          <Switch>
            <Route.Custom path="/login" component={Login} />
            <Route.Private path="/" component={Dashboard} />
          </Switch>
        </Router>
      </LocaleProvider>
    );
  }
}

export default App;
