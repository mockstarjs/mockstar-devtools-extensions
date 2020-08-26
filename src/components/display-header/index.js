import React, { Component } from 'react';
import { Button, Layout,Typography } from 'antd';
import './index.less';

export default class PageHomeHeader extends Component {
  render() {
    return (
      <Layout.Header
        style={{
          position: 'fixed',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
        className="display-header"
      >
        <Typography.Title className="title">MockStar</Typography.Title>
        <Button
          type="link"
          style={{ marginLeft: '20px' }}
          onClick={() => {
            window.open('https://mockstarjs.github.io/mockstar/');
          }}
        >
          文档
        </Button>
      </Layout.Header>
    );
  }
}
