import React, { Component } from 'react';
import { Button, Card, List, Space, Tag } from 'antd';
import { ClearOutlined, RedoOutlined } from '@ant-design/icons';

import './index.less';

export default class PageHomeNetworkList extends Component {

  render() {
    const { list, gotoDetailPage, clearList, manualUpdate } = this.props;

    return (
      <div className="page-home-network-list">
        <Card title="xhr 或 fetch 请求"
              extra={
                <Space>
                  <Button type="primary" onClick={manualUpdate} icon={<RedoOutlined />}>手动刷新</Button>
                  <Button type="danger" onClick={clearList} icon={<ClearOutlined />}>清空列表</Button>
                </Space>
              }
        >

          <List
            footer={<div>总共{list.length}条数据</div>}
            className="network-list"
            bordered
            dataSource={list}
            renderItem={(item) => (
              <List.Item key={item.id} onClick={() => {
                gotoDetailPage(item.id);
              }}>
                <div>
                  <Tag color="red">{item.id}</Tag>
                  <Tag color={item.request.method === 'GET' ? '#2db7f5' : '#87d068'}>{item.request.method}</Tag>

                  {
                    item.mockerItem ? (
                      <>
                        <Tag color="#108ee9">已匹配：{item.mockerItem.name}</Tag>
                      </>
                    ) : null
                  }

                  {
                    item.mockstar ? (
                      <>
                        <Tag color="#f50">桩对象：{item.mockstar.mocker}</Tag>
                        <Tag color="#f50">桩数据：{item.mockstar.mockModule}</Tag>
                      </>
                    ) : null
                  }

                  <span>{item.request.url}</span>
                </div>
              </List.Item>
            )}
          />

        </Card>

      </div>
    );
  }
}
