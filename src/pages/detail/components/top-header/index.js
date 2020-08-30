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
    const { currentNetwork,gotoHomePage } = this.props;

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
            {
              currentNetwork.mockstar ? (
                <Descriptions.Item label="MockStar">
                  <Tag color="#f50">{currentNetwork.mockstar.mocker}</Tag>
                  <Tag color="#f50">{currentNetwork.mockstar.mockModule}</Tag>
                </Descriptions.Item>
              ) : null
            }
          </Descriptions>
        </PageHeader>
      </div>
    );
  }
}
