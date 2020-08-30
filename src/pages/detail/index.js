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

    if (!currentNetwork) {
      return null;
    }

    const { mockStarInfo } = this.props;

    const shouldShowMockStarTab = currentNetwork.mockstar && currentNetwork.mockerItem;
    const shouldShowSampleTab = !currentNetwork.mockstar || !currentNetwork.mockerItem;

    // 默认激活的 tab，优先是 mockstar
    const defaultActiveKey = shouldShowMockStarTab ? 'mockstar-cms' : 'mockstar-sample';

    return (
      <div className="page-detail">
        <TopHeader currentNetwork={currentNetwork} gotoHomePage={this.gotoHomePage} />

        <Tabs defaultActiveKey={defaultActiveKey}>
          <Tabs.TabPane tab={`请求详情(序号=${id})`} key="request-detail">
            <RequestDetail currentNetwork={currentNetwork} />
          </Tabs.TabPane>

          {
            shouldShowSampleTab ? (
              <Tabs.TabPane tab="MockStar样例代码" key="mockstar-sample">
                <MockStarSample currentNetwork={currentNetwork} mockStarInfo={mockStarInfo} />
              </Tabs.TabPane>
            ) : null
          }

          {
            shouldShowMockStarTab ? (
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
  const { networkInfo, mockStarInfo } = state;

  return {
    list: networkInfo.list,
    mockStarInfo,
  };
}

export default connect(mapStateToProps)(PageDetail);
