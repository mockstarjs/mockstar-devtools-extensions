import React from 'react';
import { Card } from 'antd';

import './index.less';

export default function MockStarCms(props) {
  const { mockerName } = props;

  const mockstarUrl = `http://127.0.0.1:9527/mockstar-admin/mockers/${mockerName}`;

  return (
    <div className="mockstar-cms" style={{ height: 'calc(100vh - 200px)' }}>
      <Card>
        <p>完整功能请在浏览器打开: <a href={mockstarUrl} target="_blank" rel="noopener noreferrer">{mockstarUrl}</a></p>
      </Card>,
      <iframe
        title={'mockstar cms'}
        src={mockstarUrl}
        frameBorder="0"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
