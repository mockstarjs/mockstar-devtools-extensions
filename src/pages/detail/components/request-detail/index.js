import React, { Component } from 'react';
import { Card, Input } from 'antd';

import './index.less';

export default class MockStarSample extends Component {
  render() {
    const { currentNetwork } = this.props;

    return (
      <div className="page-detail-request-detail">
        <Card title={currentNetwork.request.url} bordered={false}>
          <Input.TextArea
            value={JSON.stringify(currentNetwork, null, 2)}
            autoSize={{ minRows: 3 }}
          />
        </Card>
      </div>
    );
  }
}
