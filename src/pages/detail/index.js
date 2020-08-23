import React, { Component } from 'react';
import { connect } from 'react-redux';

import './index.less';

class PageDetail extends Component {
  constructor(...props) {
    super(...props);
  }

  render() {
    const appId = this.props.match.params.id + '';
    return (
      <div className="page-detail">
        <div>xxx={appId}</div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { networkInfo } = state;

  return {
    list: networkInfo,
  };
}

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PageDetail);
