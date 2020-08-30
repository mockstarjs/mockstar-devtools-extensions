import React, { Component } from 'react';
import { List, Tag } from 'antd';

import './index.less';

export default class PageHomeNetworkList extends Component {

  render() {
    const { list, gotoDetailPage } = this.props;

    return (
      <div className="page-home-network-list">
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
                      <Tag color="#108ee9">{item.mockerItem.name}</Tag>
                    </>
                  ) : null
                }

                {
                  item.mockstar ? (
                    <>
                      <Tag color="#f50">{item.mockstar.mocker}</Tag>
                      <Tag color="#f50">{item.mockstar.mockModule}</Tag>
                    </>
                  ) : null
                }

                <span>{item.request.url}</span>
              </div>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
