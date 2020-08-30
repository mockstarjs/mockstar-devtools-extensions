import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Divider } from 'antd';

import PageHomeTopHeader from './components/top-header';
import PageHomeNetworkList from './components/network-list';

import { clearNetworkList } from '../../datas/data-network';
import { updateEnableWatch, updateMockStarServer } from '../../datas/data-mockstar';

import './index.less';

class PageHome extends Component {
  gotoDetailPage = (id) => {
    this.props.history.push(`/detail/${id}`);
  };

  handleClear = () => {
    this.props.clearNetworkList();
  };

  render() {
    const { list, mockStarInfo, updateEnableWatch, updateMockStarServer } = this.props;

    return (
      <div className="page-home">
        <PageHomeTopHeader
          mockStarInfo={mockStarInfo}
          updateEnableWatch={updateEnableWatch}
          updateMockStarServer={updateMockStarServer}
        />

        <Divider />

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
