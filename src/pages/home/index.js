import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';

import './index.less';

class PageHome extends Component {

  render() {
    const { list } = this.props;

    return (
      <div className="page-home">
        <h1>hello!</h1>
        <Button>xxxxx</Button>
        <div>{JSON.stringify(list, null, 2)}</div>
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

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHome);
