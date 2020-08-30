import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Divider, Tabs } from 'antd';

import TopHeader from './components/top-header';
import RequestDetail from './components/request-detail';
import MockStarSample from './components/mockstar-sample';
import MockStarCms from './components/mockstar-cms';

import { updateNetworkMockerItemData } from '../../datas/data-network';

import './index.less';

class PageDetail extends Component {
  componentDidMount() {
    const { mockStarInfo, updateNetworkMockerItemData } = this.props;
    const currentNetwork = this.getCurrentNetwork();

    if (mockStarInfo.isStarted && currentNetwork) {
      // 进入 detail 页面，如果当前 MockStar 是启动的，则更新一次
      updateNetworkMockerItemData(currentNetwork);
    }
  }

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

    const { mockStarInfo, updateNetworkMockerItemData } = this.props;

    const shouldShowMockStarTab = currentNetwork.mockstar && currentNetwork.mockerItem;
    const shouldShowSampleTab = !currentNetwork.mockstar || !currentNetwork.mockerItem;

    // 默认激活的 tab，优先是 mockstar
    const defaultActiveKey = shouldShowMockStarTab ? 'mockstar-cms' : 'mockstar-sample';

    return (
      <div className="page-detail">
        <TopHeader currentNetwork={currentNetwork} gotoHomePage={this.gotoHomePage} />

        <Divider />

        <Tabs defaultActiveKey={defaultActiveKey}>
          <Tabs.TabPane tab={`请求详情(序号=${id})`} key="request-detail">
            <RequestDetail currentNetwork={currentNetwork} />
          </Tabs.TabPane>

          {
            shouldShowSampleTab ? (
              <Tabs.TabPane tab="MockStar样例代码" key="mockstar-sample">
                <MockStarSample
                  currentNetwork={currentNetwork}
                  mockStarInfo={mockStarInfo}
                  updateNetworkMockerItemData={updateNetworkMockerItemData}
                />
              </Tabs.TabPane>
            ) : null
          }

          {
            shouldShowMockStarTab ? (
              <Tabs.TabPane tab="MockStar简易操作" key="mockstar-cms">
                <MockStarCms
                  mockerName={currentNetwork.mockstar.mocker}
                  mockStarInfo={mockStarInfo}
                />
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

const mapDispatchToProps = dispatch => {
  return {
    updateNetworkMockerItemData: (networkRequest) => {
      return dispatch(updateNetworkMockerItemData(networkRequest));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageDetail);
