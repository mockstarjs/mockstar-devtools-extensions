import React, { Component } from 'react';
import { Alert, Card, Descriptions, Divider, Tag } from 'antd';

import { NETWORK_CASE } from '../../../../../datas/data-network';

import './index.less';

export default class MockStarSampleTopInfo extends Component {

  render() {
    const { currentNetwork, mockStarInfo } = this.props;

    return (
      <div className="page-detail-mockstar-sample-top-info">
        <Card>

          {
            currentNetwork.networkCase === NETWORK_CASE.MATCHED_NOT_MOCK ? (
              <>
                <Alert message={`已在 ${mockStarInfo.server} 成功匹配，但是当前结果返回并不是 MockStar 的桩数据，请确定是否有效设置了代理！`}
                       type="warning" />
                <Alert
                  message={`whistle 代理设置： /(.*)${currentNetwork.mockerItem.config.route}(.*)/ ${mockStarInfo.server.replace(/^https?:\/\//, '')}`}
                  type="warning" />
                <Divider />
              </>
            ) : null
          }

          {
            currentNetwork.networkCase === NETWORK_CASE.NOT_MATCHED_BUT_MOCK ? (
              <>
                <Alert
                  message={`检测到当前返回的是 MockStar 的桩数据，${mockStarInfo.isStarted ? '但是无法在 ' + mockStarInfo.server + ' 中进行匹配！' : '由于未监听到有启动的 MockStar 服务，因此无法进行匹配！'}`}
                  type="warning" />
                <Divider />
              </>
            ) : null
          }

          {
            mockStarInfo.isStarted && currentNetwork.networkCase === NETWORK_CASE.NOT_MATCHED_NOT_MOCK ? (
              <>
                <Alert message={`如果您需要在 ${mockStarInfo.server} 创建桩对象，则可以点击【保存到项目中】，或者在文件目录中选择某一文件之后点击【单独下载该文件】`}
                       type="info" />
                <Divider />
              </>
            ) : null
          }

          {
            !mockStarInfo.isStarted && currentNetwork.networkCase === NETWORK_CASE.NOT_MATCHED_NOT_MOCK ? (
              <>
                <Alert message={`MockStar 服务未启动！启动之后才支持点击【保存到项目中】。若不启动服务，则只支持【单独下载该文件】`}
                       type="info" />
                <Divider />
              </>
            ) : null
          }


          <Descriptions size="small" column={1}>
            <Descriptions.Item label="请求地址">{currentNetwork.request.url}</Descriptions.Item>

            {
              currentNetwork.mockerItem ? (
                <>
                  <Descriptions.Item label="请求路由">{currentNetwork.mockerItem.config.route}</Descriptions.Item>
                  <Descriptions.Item label="文件路径">{currentNetwork.mockerItem.basePath}</Descriptions.Item>
                  <Descriptions.Item label="桩对象">
                    <Tag color="#f50">{currentNetwork.mockerItem.name}</Tag>
                  </Descriptions.Item>
                </>
              ) : null
            }

          </Descriptions>
        </Card>
      </div>
    );
  }
}
