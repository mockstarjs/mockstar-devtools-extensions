import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Tag } from 'antd';
import './index.less';

class PageHome extends Component {
  gotoDetail = (id) => {
    this.props.history.push(`/detail/${id}`);
  };

  render() {
    const { list } = this.props;

    return (
      <div className="page-home">
        <List
          header={<div>所有的 xhr 请求</div>}
          footer={<div>总共{list.length}条数据</div>}
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
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(PageHome);
