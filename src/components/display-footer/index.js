import React, { Component } from 'react';
import { Button, Layout } from 'antd';

import './index.less';

export default class PageHomeHeader extends Component {
  render() {
    const { pkgInfo } = this.props;

    return (
      <Layout.Footer
        className="display-footer"
      >
        <div><Button type="link" onClick={() => {
          window.open(`https://github.com/mockstarjs/${pkgInfo.name}`);
        }}>{pkgInfo.name}</Button> v{pkgInfo.version}</div>
      </Layout.Footer>
    );
  }
}
