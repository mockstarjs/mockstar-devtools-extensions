import React, { Component } from 'react';
import { Alert, Input, Space, Switch, Typography } from 'antd';

import './index.less';

export default class PageHomeTopHeader extends Component {
  handleEnableWatchChange = (checked) => {
    this.props.updateEnableWatch(checked);
  };

  render() {
    const { mockStarInfo } = this.props;

    return (
      <div className="page-home-top-header">
        <Space>
          <Typography.Text>监听 MockStar 服务：</Typography.Text>

          <Switch
            checkedChildren="开启"
            unCheckedChildren="关闭"
            defaultChecked={mockStarInfo.enableWatch}
            onChange={this.handleEnableWatchChange}
          />

          <Input
            defaultValue={mockStarInfo.server}
            disabled={!mockStarInfo.enableWatch}
            placeholder="请输入服务地址，例如 http://127.0.0.1:9527"
          />
        </Space>

        {
          !mockStarInfo.enableWatch ? (
            <Alert message={`提示：开启监听之后，可以自动对 xhr 和 fetch 请求进行匹配。`} type="info" />
          ) : null
        }

        {
          mockStarInfo.enableWatch && mockStarInfo.isStarted ? (
            <Alert message={`正在监听 ${mockStarInfo.server} ...`} type="success" />
          ) : null
        }

        {
          mockStarInfo.enableWatch && !mockStarInfo.isStarted ? (
            <Alert message={`${mockStarInfo.server} 并没有启动`} type="error" />
          ) : null
        }

      </div>
    );
  }
}

