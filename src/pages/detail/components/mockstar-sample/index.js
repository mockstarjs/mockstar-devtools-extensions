import React, { Component } from 'react';
import { Button, Card, Col, Input, Modal, Row, Tree } from 'antd';

import { createFolderTree, downloadSampleCode } from '../../business';

import './index.less';

export default class MockStarSample extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      selectedTreeKey: 'mockModulesDebugIndexJs',
      showSaveSampleDlg: false,
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

  handleShowSaveSampleDlg = () => {
    this.setState({
      showSaveSampleDlg: true,
    });

  };

  handleSaveSampleDlgOk = () => {
    this.setState({
      showSaveSampleDlg: false,
    });
  };

  handleSaveSampleDlgCancel = () => {
    this.setState({
      showSaveSampleDlg: false,
    });
  };

  render() {
    const { selectedTreeKey, showSaveSampleDlg } = this.state;
    const { currentNetwork } = this.props;

    const { treeData, treeNodeMap } = createFolderTree(currentNetwork);
    const treeNode = treeNodeMap[selectedTreeKey];

    return (
      <div className="page-detail-mockstar-sample">
        <Row>
          <Col span={8}>
            <Card title="推荐文件目录"
                  extra={
                    <Button type="primary" onClick={this.handleShowSaveSampleDlg}>生成到项目中</Button>
                  }
                  style={{ minWidth: '300px' }}
            >
              <Tree.DirectoryTree
                defaultExpandAll
                defaultSelectedKeys={[selectedTreeKey]}
                onSelect={this.handleSelectTree}
                treeData={treeData}
              />
            </Card>
          </Col>

          <Col span={16}>
            <Card title={`预览 ${(treeNode && treeNode.path)}`}
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

        <Modal
          title="生成到项目中"
          visible={showSaveSampleDlg}
          onOk={this.handleSaveSampleDlgOk}
          onCancel={this.handleSaveSampleDlgCancel}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </Modal>
      </div>
    );
  }
}
