import React, { Component } from 'react';
import { connect } from 'react-redux';

import PageHomeTopHeader from './components/top-header';
import PageHomeNetworkList from './components/network-list';

import { clearNetworkList } from '../../datas/data-network';
import { loadMockStarDetail, updateEnableWatch, updateMockStarServer } from '../../datas/data-mockstar';

import './index.less';

class PageHome extends Component {
  gotoDetailPage = (id) => {
    this.props.history.push(`/detail/${id}`);
  };

  handleClear = () => {
    this.props.clearNetworkList();
  };

  handleUpdateEnableWatch = (enableWatch) => {
    // 更新
    this.props.updateEnableWatch(enableWatch);

    // 如果是开启，则需要刷新一次状态
    if (enableWatch) {
      // 获得 mockstar 的信息
      this.props.loadMockStarDetail();
    }
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHome);
