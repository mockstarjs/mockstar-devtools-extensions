import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';

import './index.less';

class PageDetail extends Component {
  gotoHome = () => {
    this.props.history.push(`/`);
  };

  render() {
    const id = this.props.match.params.id + '';
    const { list } = this.props;

    return (
      <div className="page-detail">
        <Button onClick={this.gotoHome}>返回</Button>
        <div>xxx={id}</div>
        <div>{JSON.stringify(list[id], null, 2)}</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(PageDetail);
