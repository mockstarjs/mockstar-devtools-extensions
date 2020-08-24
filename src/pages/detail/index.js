import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Col, Input, Row, Tree } from 'antd';

import { createFolderTree } from './business';

import './index.less';

class PageDetail extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      selectedTreeKey: 'mockerName',
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

  render() {
    const id = this.props.match.params.id;
    const { list } = this.props;
    const { selectedTreeKey } = this.state;

    const { treeData, treeMap } = createFolderTree(list[id]);
    const treeNode = treeMap[selectedTreeKey];

    return (
      <div className="page-detail">
        <Button onClick={this.gotoHome}>返回</Button>

        <Row>
          <Col span={8}>
            <Card title={`请求列表序号：${parseInt(id) + 1} 的详细信息`} bordered={false}>
              <Input.TextArea
                value={JSON.stringify(list[id], null, 2)}
                placeholder="Controlled autosize"
                autoSize={{ minRows: 3 }}
              />
            </Card>
          </Col>

          <Col span={8}>
            <Tree.DirectoryTree
              defaultExpandAll
              onSelect={this.handleSelectTree}
              treeData={treeData}
            />
          </Col>

          <Col span={8}>
            <Card title={`${selectedTreeKey} 文件内容`} bordered={false}>
              <Input.TextArea
                value={treeNode&&treeNode.content}
                placeholder="Controlled autosize"
                autoSize={{ minRows: 3 }}
              />
            </Card>
          </Col>
        </Row>

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
