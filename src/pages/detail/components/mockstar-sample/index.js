import React, { Component } from 'react';
import { Button, Card, Col, Form, Input, Modal, Row, Tree } from 'antd';

import axios from 'axios';

import { createFolderTree, downloadSampleCode } from '../../business';

import './index.less';

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
export default class MockStarSample extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      selectedTreeKey: 'mockModulesDebugIndexJs',
      showSaveSampleDlg: false,
      mockServerPath: '',
    };

    this.formRef = React.createRef();
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

    axios.get('http://127.0.0.1:9527/mockstar-cgi/detail')
      .then((res) => {
        console.log(res);

        const { mockServerPath } = res.data.config;

        this.setState({
          mockServerPath,
        });

        this.formRef.current.setFieldsValue({
          parentPath: mockServerPath,
        });
      })
      .catch((err) => {
        console.error(err);
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

  onFinish = values => {
    console.log('Success:', values);
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const { selectedTreeKey, showSaveSampleDlg, mockServerPath } = this.state;
    const { currentNetwork } = this.props;

    const { treeData, treeNodeMap, businessMocker } = createFolderTree(currentNetwork);
    const treeNode = treeNodeMap[selectedTreeKey];

    console.log(currentNetwork);

    const initialValues = {
      parentPath: mockServerPath,
      mockerName: businessMocker.config.name,
      mockerMethod: businessMocker.config.method,
      mockerRoute: businessMocker.config.route,
    };

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
          width={'90%'}
        >
          <Form
            layout="vertical"
            ref={this.formRef}
            initialValues={initialValues}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}>
            <Form.Item
              label="父级目录"
              name="parentPath"
              rules={[{ required: true, message: 'Please input your parentPath!' }]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="桩数据文件夹名字"
              name="mockerName"
              rules={[{ required: true, message: 'Please input your mockerName!' }]}>
              <Input />
            </Form.Item>

            <Form.Item
              label="HTTP Method"
              name="mockerMethod"
              rules={[{ required: true, message: 'Please input your mockerMethod!' }]}>
              <Input readOnly/>
            </Form.Item>

            <Form.Item
              label="路由"
              name="mockerRoute"
              rules={[{ required: true, message: 'Please input your mockerRoute!' }]}>
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}
