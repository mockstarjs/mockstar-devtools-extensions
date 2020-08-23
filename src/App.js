import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Detail from './pages/detail';
import Home from './pages/home';

import './App.less';

export default class App extends Component {
  constructor(...props) {
    super(...props);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path={`/`} component={Home} />
          <Route exact path={`/detail/:id`} component={Detail} />
        </Switch>
      </Router>
    );
  }
}
