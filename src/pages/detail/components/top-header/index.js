import React, { Component } from 'react';
import { Descriptions, PageHeader, Tag } from 'antd';

import { downloadSampleCode } from '../../business';

import './index.less';

export default class PageDetailTopHeader extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      selectedTreeKey: 'mockModulesDebugIndexJs',
    };
  }

  handleSelectTree = (keys, event) => {
    console.log('Select Tree Node', keys, event);

    this.setState({
      selectedTreeKey: keys[0],
    });
  };

  handleDownload = (treeNode) => {
    if (!treeNode) {
      console.log('treeNode is undefined!');
      return;
    }

    if (!treeNode.isLeaf) {
      console.log('treeNode is not isLeaf!');
      return;
    }

    downloadSampleCode(treeNode.content, treeNode.title);
  };

  render() {
    const { currentNetwork, gotoHomePage } = this.props;

    return (
      <div className="page-detail-top-header">
        <PageHeader
          className="site-page-header"
          onBack={gotoHomePage}
          title="返回"
          subTitle=""
        >
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="请求地址">{currentNetwork.request.url}</Descriptions.Item>
          </Descriptions>
          {
            currentNetwork.mockerItem ? (
              <>
                <Tag color="#108ee9">已匹配：{currentNetwork.mockerItem.name}</Tag>
              </>
            ) : null
          }

          {
            currentNetwork.mockstar ? (
              <>
                <Tag color="#f50">桩对象：{currentNetwork.mockstar.mocker}</Tag>
                <Tag color="#f50">桩数据：{currentNetwork.mockstar.mockModule}</Tag>
              </>
            ) : null
          }

          {
            currentNetwork.mockerItem ? (
              <Tag color="purple">{currentNetwork.networkCase}</Tag>
            ) : null
          }
        </PageHeader>
      </div>
    );
  }
}
