import React, { Component } from 'react';
import { connect } from 'react-redux';

import PageHomeTopHeader from './components/top-header';
import PageHomeNetworkList from './components/network-list';

import { clearNetworkList, updateNetworkMockerItemData } from '../../datas/data-network';
import {
  loadMockStarDetail,
  updateEnableWatch,
  updateIsStarted,
  updateMockStarServer,
} from '../../datas/data-mockstar';

import './index.less';

class PageHome extends Component {
  gotoDetailPage = (id) => {
    this.props.history.push(`/detail/${id}`);
  };

  handleClear = () => {
    this.props.clearNetworkList();
  };

  handleUpdateEnableWatch = (enableWatch) => {
    (async () => {
      // 更新 enableWatch
      await this.props.updateEnableWatch(enableWatch);

      if (enableWatch) {
        // 如果是开启监听，则需要刷新一次 mockstar 状态
        await this.props.loadMockStarDetail();
      } else {
        // 如果是关闭监听，则需要将 isStarted 设置为 false
        this.props.updateIsStarted(false);
      }

      // 更新列表
      this.props.list.forEach((networkRequest) => {
        this.props.updateNetworkMockerItemData(networkRequest);
      });
    })();
  };

  render() {
    const { list, mockStarInfo, updateMockStarServer } = this.props;

    return (
      <div className="page-home">
        <PageHomeTopHeader
          mockStarInfo={mockStarInfo}
          updateEnableWatch={this.handleUpdateEnableWatch}
          updateMockStarServer={updateMockStarServer}
        />

        <PageHomeNetworkList
          list={list}
          clearList={this.handleClear}
          gotoDetailPage={this.gotoDetailPage}
        />
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
    loadMockStarDetail: () => {
      return dispatch(loadMockStarDetail());
    },

    clearNetworkList: () => {
      return dispatch(clearNetworkList());
    },

    updateEnableWatch: (enableWatch) => {
      return dispatch(updateEnableWatch(enableWatch));
    },

    updateMockStarServer: (server) => {
      return dispatch(updateMockStarServer(server));
    },

    updateIsStarted: (isStarted) => {
      return dispatch(updateIsStarted(isStarted));
    },

    updateNetworkMockerItemData: (networkRequest) => {
      return dispatch(updateNetworkMockerItemData(networkRequest));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHome);
