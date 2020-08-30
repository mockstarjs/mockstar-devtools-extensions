import React, { Component } from 'react';
import { Alert, Button, Col, Row } from 'antd';

import './index.less';

export default class PageHomeTopHeader extends Component {

  render() {
    const { mockStarInfo, clearList } = this.props;

    return (
      <div className="page-home-top-header">
        <Row>
          <Col span={24}>
            <Alert message={`port=${mockStarInfo.config.port},rootPath=${mockStarInfo.config.rootPath}`} type="info" />
          </Col>
          <Col span={8} offset={16}>
            <Button type="danger" style={{ 'float': 'right' }} onClick={clearList}>清空列表</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
