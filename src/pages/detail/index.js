import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Col, Descriptions, Input, PageHeader, Row, Tabs, Tag, Tree } from 'antd';

import { createFolderTree, downloadSampleCode } from './business';

import MockStarCms from './components/mockstar-cms';

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

  handleLoadTree = (keys, event) => {
    console.log('Trigger success_json_file.json', keys, event);

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
        <PageHeader
          className="site-page-header"
          onBack={this.gotoHome}
          title="返回"
          subTitle=""
        >
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="请求地址">{currentNetwork.request.url}</Descriptions.Item>
            {
              currentNetwork.mockstar ? (
                <Descriptions.Item label="mockstar">
                  <Tag color="#f50">{currentNetwork.mockstar.mocker}</Tag>
                  <Tag color="#f50">{currentNetwork.mockstar.mockModule}</Tag>
                </Descriptions.Item>
              ) : null
            }
          </Descriptions>
        </PageHeader>

        <Tabs defaultActiveKey={currentNetwork.mockstar ? '3' : '2'}>
          <Tabs.TabPane tab={`请求详情(id=${id})`} key="1">
            <Card title={currentNetwork.request.url} bordered={false}>
              <Input.TextArea
                value={JSON.stringify(currentNetwork, null, 2)}
                autoSize={{ minRows: 3 }}
              />
            </Card>
          </Tabs.TabPane>
          <Tabs.TabPane tab="mockstar样例代码" key="2">
            <Row>
              <Col span={8}>
                <Tree.DirectoryTree
                  defaultExpandAll
                  defaultSelectedKeys={[selectedTreeKey]}
                  onSelect={this.handleSelectTree}
                  onLoad={this.handleLoadTree}
                  treeData={treeData}
                />
              </Col>

              <Col span={16}>
                <Card title={`${(treeNode && treeNode.path) || '请选择'}`}
                      extra={<Button type="primary" onClick={() => {
                        this.handleDownload(treeNode);
                      }}>下载该文件</Button>}
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

          {
            currentNetwork.mockstar ? (
              <Tabs.TabPane tab="mockstar简易操作" key="3">
                <MockStarCms mockerName={currentNetwork.mockstar.mocker} />
              </Tabs.TabPane>
            ) : null
          }

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
