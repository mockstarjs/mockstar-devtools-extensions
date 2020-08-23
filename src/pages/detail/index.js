import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button, Card, Input } from 'antd';

import './index.less';

class PageDetail extends Component {
  gotoHome = () => {
    this.props.history.push(`/`);
  };

  render() {
    const id = this.props.match.params.id;
    const { list } = this.props;

    return (
      <div className="page-detail">
        <Button onClick={this.gotoHome}>返回</Button>

        <Card title={`请求列表序号：${parseInt(id) + 1} 的详细信息`} bordered={false} style={{ width: '30%' }}>
          <Input.TextArea
            value={JSON.stringify(list[id], null, 2)}
            placeholder="Controlled autosize"
            autoSize={{ minRows: 3 }}
          />
        </Card>

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
