import React, { Component } from 'react';
import { Card, Descriptions } from 'antd';

import './index.less';

export default class MockStarSampleTopInfo extends Component {

  render() {
    const { currentNetwork } = this.props;

    return (
      <div className="page-detail-mockstar-sample-top-info">
        <Card>
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="请求地址">{currentNetwork.request.url}</Descriptions.Item>

            {
              currentNetwork.mockerItem ? (
                <>
                  <Descriptions.Item label="请求路由">{currentNetwork.mockerItem.config.route}</Descriptions.Item>
                  <Descriptions.Item label="文件路径">{currentNetwork.mockerItem.basePath}</Descriptions.Item>
                  <Descriptions.Item label="桩对象">{currentNetwork.mockerItem.name}</Descriptions.Item>
                </>
              ) : null
            }

          </Descriptions>
        </Card>
      </div>
    );
  }
}
