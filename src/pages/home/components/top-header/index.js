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

        <Alert message={`port=${mockStarInfo.config.port},rootPath=${mockStarInfo.config.rootPath}`} type="info" />
      </div>
    );
  }
}

