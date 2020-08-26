import React, { Component } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import _ from 'lodash';
import Detail from './pages/detail';
import Home from './pages/home';

import Header from './components/display-header';

import { addInNetworkList, updateNetworkRspData } from './datas/data-network';
import { dataGet, dataMockStar, dataPost } from './datas/data-network/mock';

import './App.less';
import { Layout } from 'antd';

const IN_CHROME_DEVTOOLS = window.chrome && window.chrome.devtools;

export default class App extends Component {
  constructor(...props) {
    super(...props);

    // 自定义 id
    this.id = this.props.networkInfo.list.length;

    // debug 调试
    if (!this.isMocked && !IN_CHROME_DEVTOOLS) {
      console.log('not in chrome devtools!');
      this.isMocked = true;
      this.props.dispatch(addInNetworkList(dataGet));
      this.props.dispatch(addInNetworkList(dataPost));
      this.props.dispatch(addInNetworkList(dataMockStar));
    }
  }

  componentDidMount() {
    if (IN_CHROME_DEVTOOLS) {
      // https://developer.chrome.com/extensions/devtools_network#event-onRequestFinished
      window.chrome.devtools.network.onRequestFinished.addListener((request) => {
        console.log('==onRequestFinished==', request._resourceType, request);

        if (request._resourceType === 'xhr' || request._resourceType === 'fetch') {
          // 自增1
          this.id = this.id + 1;
          const curId = this.id;

          // 无需保存所有的信息，否则打印出来的话会比较复杂
          const savedRequest = _.merge({ id: curId }, request);
          delete savedRequest._initiator;
          delete savedRequest.timings;

          // 追加到列表中
          this.props.dispatch(addInNetworkList(savedRequest));

          // 由于 response.body 不一定有值，需要调用 request.getContent 方法才能拿到结果
          // https://developer.chrome.com/extensions/devtools_network#type-Request
          if (!savedRequest.response.body) {
            request.getContent((content, encoding) => {
              console.log('==getContent==', curId, request.request.url, content, encoding);
              this.props.dispatch(updateNetworkRspData(curId, content));
            });
          }

        }
      });
    } else {
      // componentDidMount will not be called again if you are already at a classes/:id route.
      // https://stackoverflow.com/questions/34468052/react-router-componentdidmount-not-called-when-navigating-to-url
    }
  }

  render() {
    return (
      <Layout>
        <Header />

        <Layout.Content
          style={{
            marginTop: 64,
            display: 'flex',
            height: 'calc(100vh - 80px)',
          }}
        >
          <Router>
            <Switch>
              <Route exact path={`/`} component={Home} />
              <Route exact path={`/detail/:id`} component={Detail} />
            </Switch>
          </Router>
        </Layout.Content>
      </Layout>
    );
  }
}
