import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Col, Input, Row, Tabs, Tree,Tag } from 'antd';

import { createFolderTree, downloadSampleCode } from './business';

import './index.less';

class PageDetail extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      selectedTreeKey: 'mockModulesDebugIndexJs',
    };
  }

  gotoHome = () => {
    this.props.history.push(`/`);
  };

  handleSelectTree = (keys, event) => {
    console.log('Trigger Select', keys, event);

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

  getCurrentNetwork = () => {
    const id = parseInt(this.props.match.params.id);
    const { list } = this.props;

    return list.filter(item => item.id === id)[0];
  };

  render() {
    const id = this.props.match.params.id;
    const { selectedTreeKey } = this.state;
    const currentNetwork = this.getCurrentNetwork();

    const { treeData, treeNodeMap } = createFolderTree(currentNetwork);
    const treeNode = treeNodeMap[selectedTreeKey];

    return (
      <div className="page-detail">
        <Button onClick={this.gotoHome} type="primary">返回</Button>
        <Tag>{currentNetwork.request.url}</Tag>

        <Tabs defaultActiveKey="2">
          <Tabs.TabPane tab={`请求详情(id=${id})`} key="1">
            <Card title={currentNetwork.request.url} bordered={false}>
              <Input.TextArea
                value={JSON.stringify(currentNetwork, null, 2)}
                autoSize={{ minRows: 3 }}
              />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab="mockstar" key="2">
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
                      }}>下载</Button>}
                >
                  <Input.TextArea
                    value={treeNode && treeNode.content}
                    placeholder="点击左侧目录树查看文件内容"
                    autoSize={{ minRows: 3 }}
                  />
                </Card>
              </Col>
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { networkInfo } = state;

  return {
    list: networkInfo.list,
  };
}

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PageDetail);
