import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
} from 'react-router-dom'
import { Provider } from 'react-redux';
import { Route } from './components';
import LocaleProvider from './l18n';
import store from './store';

import {
  Login,
  Dashboard,
} from './pages';

class App extends Component {

  render() {
    return (
      <Provider store={store}>
        <LocaleProvider>
          <Router>
            <Switch>
              <Route.Custom path="/login" component={Login} />
              <Route.Private path="/" component={Dashboard} />
            </Switch>
          </Router>
        </LocaleProvider>
      </Provider>
    );
  }
}

export default App;
