import React, { Component } from 'react';
import { Button, Form, Input, Modal } from 'antd';

import './index.less';

export default class MockStarSample extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      selectedTreeKey: 'mockModulesDebugIndexJs',
      showSaveSampleDlg: false,
      mockServerPath: '',
      isMockStarNotStarted: false
    };

    this.formRef = React.createRef();
  }

  handleSaveSampleDlgOk = () => {
    this.props.changeShowCreateMockerDlg(false);
  };

  handleSaveSampleDlgCancel = () => {
    this.props.changeShowCreateMockerDlg(false);
  };

  onFinish = values => {
    console.log('Success:', values);
  };

  onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo);
  };

  render() {
    const { businessMocker, mockServerPath } = this.props;

    const initialValues = {
      parentPath: mockServerPath,
      mockerName: businessMocker.config.name,
      mockerMethod: businessMocker.config.method,
      mockerRoute: businessMocker.config.route
    };

    return (
      <Modal
        title="创建 mocker"
        visible={true}
        onOk={this.handleSaveSampleDlgOk}
        onCancel={this.handleSaveSampleDlgCancel}
        width={'90%'}
        footer={null}
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
            <Input readOnly />
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
    );
  }
}
