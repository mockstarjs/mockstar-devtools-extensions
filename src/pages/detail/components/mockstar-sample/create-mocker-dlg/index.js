import React, { Component } from 'react';
import { Button, Form, Input, message, Modal, Space } from 'antd';

import './index.less';

export default class MockStarSample extends Component {
  handleHideDlg = () => {
    this.props.changeShowCreateMockerDlg(false);
  };

  onFinish = values => {
    console.log('Success:', values);

    this.props.handleCreateMocker(values)
      .then((data) => {
        if (data.isSuccess) {
          message.success(`保存成功！`);
          this.props.changeShowCreateMockerDlg(false);
        } else {
          message.error(`保存失败：${data.msg}`);
        }
      })
      .catch((err) => {
        console.log(err);
        message.error(`保存出现异常：${(err && err.message) || err}`);
      });
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
      mockerRoute: businessMocker.config.route,
    };

    return (
      <Modal
        title="创建 mocker"
        visible={true}
        width={'90%'}
        footer={null}
        onCancel={this.handleHideDlg}
      >
        <Form
          layout="vertical"
          initialValues={initialValues}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}>
          <Form.Item
            label="父级目录"
            name="parentPath"
            rules={[{ required: true, message: 'Please input your parentPath!' }]}>
            <Input disabled />
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
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="路由"
            name="mockerRoute"
            rules={[{ required: true, message: 'Please input your mockerRoute!' }]}>
            <Input />
          </Form.Item>

          <Form.Item style={{ width: '130px', margin: 'auto' }}>
            <Space>
              <Button onClick={this.handleHideDlg}> 返回 </Button>
              <Button type="primary" htmlType="submit"> 提交 </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}
