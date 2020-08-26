import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Col, Divider, List, Row, Tag } from 'antd';

import { clearNetworkList } from '../../datas/data-network';

import './index.less';

class PageHome extends Component {
  gotoDetail = (id) => {
    this.props.history.push(`/detail/${id}`);
  };

  handleClear = () => {
    this.props.clearNetworkList();
  };

  render() {
    const { list } = this.props;

    return (
      <div className="page-home">

        <Row>
          <Col span={8} offset={16}>
            <Button type="danger" style={{ 'float': 'right' }} onClick={this.handleClear}>清空列表</Button>
          </Col>
        </Row>

        <Divider />

        <List
          footer={<div>总共{list.length}条数据</div>}
          className="network-list"
          bordered
          dataSource={list}
          renderItem={(item) => (
            <List.Item key={item.id} onClick={() => {
              this.gotoDetail(item.id);
            }}>
              <div>
                <Tag color="red">{item.id}</Tag>

                {
                  item.mockstar ? (
                    <>
                      <Tag color="#f50">{item.mockstar.mocker}</Tag>
                      <Tag color="#f50">{item.mockstar.mockModule}</Tag>
                    </>
                  ) : null
                }

                <Tag color={item.request.method === 'GET' ? '#2db7f5' : '#87d068'}>{item.request.method}</Tag>
                <span>{item.request.url}</span>
              </div>
            </List.Item>
          )}
        />
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
  return {
    clearNetworkList: () => {
      return dispatch(clearNetworkList());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHome);
