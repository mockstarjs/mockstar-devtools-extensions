import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, Descriptions, Input, PageHeader, Tabs, Tag } from 'antd';

import MockStarCms from './components/mockstar-cms';
import MockStarSample from './components/mockstar-sample';

import './index.less';

class PageDetail extends Component {
  gotoHome = () => {
    this.props.history.push(`/`);
  };

  getCurrentNetwork = () => {
    const id = parseInt(this.props.match.params.id);
    const { list } = this.props;

    return list.filter(item => item.id === id)[0];
  };

  render() {
    const id = this.props.match.params.id;

    const currentNetwork = this.getCurrentNetwork();

    return (
      <div className="page-detail">
        <PageHeader
          className="site-page-header"
          onBack={this.gotoHome}
          title="返回"
          subTitle=""
        >
          <Descriptions size="small" column={1}>
            <Descriptions.Item label="请求地址">{currentNetwork.request.url}</Descriptions.Item>
            {
              currentNetwork.mockstar ? (
                <Descriptions.Item label="mockstar">
                  <Tag color="#f50">{currentNetwork.mockstar.mocker}</Tag>
                  <Tag color="#f50">{currentNetwork.mockstar.mockModule}</Tag>
                </Descriptions.Item>
              ) : null
            }
          </Descriptions>
        </PageHeader>

        <Tabs defaultActiveKey={currentNetwork.mockstar ? '3' : '2'}>
          <Tabs.TabPane tab={`请求详情(序号=${id})`} key="1">
            <Card title={currentNetwork.request.url} bordered={false}>
              <Input.TextArea
                value={JSON.stringify(currentNetwork, null, 2)}
                autoSize={{ minRows: 3 }}
              />
            </Card>
          </Tabs.TabPane>

          <Tabs.TabPane tab="mockstar样例代码" key="2">
            <MockStarSample currentNetwork={currentNetwork} />
          </Tabs.TabPane>

          {
            currentNetwork.mockstar ? (
              <Tabs.TabPane tab="mockstar简易操作" key="3">
                <MockStarCms mockerName={currentNetwork.mockstar.mocker} />
              </Tabs.TabPane>
            ) : null
          }

        </Tabs>
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

export default connect(mapStateToProps, mapDispatchToProps)(PageDetail);
