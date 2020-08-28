import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Input, Tabs } from 'antd';

import TopHeader from './components/top-header';
import MockStarCms from './components/mockstar-cms';
import MockStarSample from './components/mockstar-sample';

import './index.less';

class PageDetail extends Component {
  gotoHomePage = () => {
    this.props.history.push(`/`);
  };

  getCurrentNetwork = () => {
    const id = parseInt(this.props.match.params.id);

    return this.props.list.filter(item => item.id === id)[0];
  };

  render() {
    const id = this.props.match.params.id;
    const currentNetwork = this.getCurrentNetwork();

    return (
      <div className="page-detail">
        <TopHeader currentNetwork={currentNetwork} gotoHomePage={this.gotoHomePage} />

        <Tabs defaultActiveKey={currentNetwork.mockstar ? '3' : '2'}>
          <Tabs.TabPane tab={`请求详情(序号=${id})`} key="1">
            <Card title={currentNetwork.request.url} bordered={false}>
              <Input.TextArea
                value={JSON.stringify(currentNetwork, null, 2)}
                autoSize={{ minRows: 3 }}
              />
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab="mockstar样例代码" key="2">
            <MockStarSample currentNetwork={currentNetwork} />
          </Tabs.TabPane>

          {
            currentNetwork.mockstar ? (
              <Tabs.TabPane tab="mockstar简易操作" key="3">
                <MockStarCms mockerName={currentNetwork.mockstar.mocker} />
              </Tabs.TabPane>
            ) : null
          }

        </Tabs>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { networkInfo } = state;

  return {
    list: networkInfo.list,
  };
}

export default connect(mapStateToProps)(PageDetail);
