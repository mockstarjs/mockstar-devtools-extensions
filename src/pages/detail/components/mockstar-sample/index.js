import React, { Component } from 'react';
import { Button, Card, Col, Input, Row, Tree } from 'antd';

import { createFolderTree, downloadSampleCode } from '../../business';

import './index.less';

export default class MockStarSample extends Component {
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
    const { selectedTreeKey } = this.state;
    const { currentNetwork } = this.props;

    const { treeData, treeNodeMap } = createFolderTree(currentNetwork);
    const treeNode = treeNodeMap[selectedTreeKey];

    return (
      <div className="page-detail-mockstar-sample">
        <Row>
          <Col span={8}>
            <Tree.DirectoryTree
              defaultExpandAll
              defaultSelectedKeys={[selectedTreeKey]}
              onSelect={this.handleSelectTree}
              treeData={treeData}
            />
          </Col>

          <Col span={16}>
            <Card title={`${(treeNode && treeNode.path) || '请选择'}`}
                  extra={<Button type="primary" onClick={() => {
                    this.handleDownload(treeNode);
                  }}>单独下载该文件</Button>}
            >
              <Input.TextArea
                value={treeNode && treeNode.content}
                placeholder="点击左侧目录树查看文件内容"
                autoSize={{ minRows: 3 }}
              />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
