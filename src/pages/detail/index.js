import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs } from 'antd';

import TopHeader from './components/top-header';
import RequestDetail from './components/request-detail';
import MockStarSample from './components/mockstar-sample';
import MockStarCms from './components/mockstar-cms';

import './index.less';

class PageDetail extends Component {
  /**
   * 跳转到首页
   */
  gotoHomePage = () => {
    this.props.history.push(`/`);
  };

  /**
   * 获得当前的请求对象
   * @return {Object}
   */
  getCurrentNetwork = () => {
    const id = parseInt(this.props.match.params.id);

    return this.props.list.filter(item => item.id === id)[0];
  };

  render() {
    const id = this.props.match.params.id;
    const currentNetwork = this.getCurrentNetwork();

    // 默认激活的 tab，优先是 mockstar
    const defaultActiveKey = currentNetwork.mockstar ? 'mockstar-cms' : 'mockstar-sample';

    return (
      <div className="page-detail">
        <TopHeader currentNetwork={currentNetwork} gotoHomePage={this.gotoHomePage} />

        <Tabs defaultActiveKey={defaultActiveKey}>
          <Tabs.TabPane tab={`请求详情(序号=${id})`} key="request-detail">
            <RequestDetail currentNetwork={currentNetwork} />
          </Tabs.TabPane>

          <Tabs.TabPane tab="MockStar样例代码" key="mockstar-sample">
            <MockStarSample currentNetwork={currentNetwork} />
          </Tabs.TabPane>

          {
            currentNetwork.mockstar ? (
              <Tabs.TabPane tab="MockStar简易操作" key="mockstar-cms">
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
