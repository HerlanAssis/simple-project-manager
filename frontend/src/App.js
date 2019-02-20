import React, { Component } from 'react';
import {
  BrowserRouter as Router, 
  Switch,
  Route,
} from 'react-router-dom'
import Home from './pages/home';
import Login from './pages/login';

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/" component={Login} />
          <Route path="/home" component={Home} />
        </Switch>
      </Router>
    );
  }
}

export default App;
