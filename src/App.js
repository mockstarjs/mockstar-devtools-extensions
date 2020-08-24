import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Detail from './pages/detail';
import Home from './pages/home';

import { addInNetworkList } from './datas/data-network';
import { dataGet, dataPost } from './datas/data-network/mock';

import './App.less';

export default class App extends Component {
  constructor(...props) {
    super(...props);
  }

  componentDidMount() {
    if (window.chrome && window.chrome.devtools) {
      window.chrome.devtools.network.onRequestFinished.addListener((request) => {
        this.props.dispatch(addInNetworkList(request));
      });
    } else {
      console.log('not in chrome devtools!');
      this.props.dispatch(addInNetworkList(dataGet));
      this.props.dispatch(addInNetworkList(dataPost));
    }
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
