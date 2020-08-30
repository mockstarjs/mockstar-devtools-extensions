import React, { Component } from 'react';
import { Button, Card, Col, Input, Row, Tree } from 'antd';
import { CloudDownloadOutlined, DownloadOutlined } from '@ant-design/icons';

import axios from 'axios';

import CreateMockerDlg from './create-mocker-dlg';
import TopInfo from './top-info';

import { createFolderTree, downloadSampleCode } from '../../business';
import { NETWORK_CASE } from '../../../../datas/data-network';

import './index.less';

export default class MockStarSample extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      selectedTreeKey: 'mockModulesDebugIndexJs',
      isShowCreateMockerDlg: false,
    };
  }

  handleSelectTree = (keys, event) => {
    console.log('Select Tree Node', keys, event);

    this.setState({
      selectedTreeKey: keys[0],
    });
  };

  handleDownload = (treeNode) => {
    if (!treeNode) {
      console.log('treeNode is undefined!');
      return;
    }

    if (!treeNode.isLeaf) {
      console.log('treeNode is not isLeaf!');
      return;
    }

    downloadSampleCode(treeNode.content, treeNode.title);
  };

  handleShowCreateMockerDlg = () => {
    // 只要 MockStar 启动了就可以打开创建对话框
    this.setState({
      isShowCreateMockerDlg: this.props.mockStarInfo.isStarted,
    });
  };

  handleCreateMocker = queryData => {
    const { currentNetwork, mockStarInfo } = this.props;

    // 获得 requestURL
    const requestURL = `${mockStarInfo.server}/mockstar-cgi/create-mocker`;

    // 附加上当前接口请求的数据
    queryData.debugMockModuleJsonData = currentNetwork.response.jsonData;

    console.log(`准备发送请求：${JSON.stringify(queryData)}`);

    return axios.post(requestURL, queryData)
      .then(res => {
        const { data } = res;

        if (process.env.NODE_ENV !== 'production') {
          console.log(`url=${requestURL}`, queryData, data);
        }

        if (data.retcode === 0) {
          console.log(data, 'success');

          // 刷新状态
          this.props.updateNetworkMockerItemData(this.props.currentNetwork);

          return {
            isSuccess: true,
            data,
          };
        } else {
          console.log(data.result, 'error');
          return {
            isSuccess: false,
            msg: data.result,
          };
        }
      })
      .catch(err => {
        console.log((err && err.message) || err, 'error');
        return {
          isSuccess: false,
          msg: (err && err.message) || err,
        };
      });
  };

  changeShowCreateMockerDlg = (isShow) => {
    this.setState({
      isShowCreateMockerDlg: isShow,
    });
  };

  render() {
    const { selectedTreeKey, isShowCreateMockerDlg } = this.state;
    const { currentNetwork, mockStarInfo } = this.props;

    const { treeData, treeNodeMap, businessMocker } = createFolderTree(currentNetwork);
    const treeNode = treeNodeMap[selectedTreeKey];

    const couldCreateMocker = mockStarInfo.isStarted && [NETWORK_CASE.NOT_MATCHED_NOT_MOCK].indexOf(currentNetwork.networkCase) > -1;
    const couldShowSampleCode = [
      NETWORK_CASE.NOT_MATCHED_NOT_MOCK,
      NETWORK_CASE.MATCHED_NOT_MOCK,
    ].indexOf(currentNetwork.networkCase) > -1;

    return (
      <div className="page-detail-mockstar-sample">
        <Row>
          <Col span={24}>
            <TopInfo currentNetwork={currentNetwork} mockStarInfo={mockStarInfo} />
          </Col>

          {
            couldShowSampleCode ? (
              <>
                <Col span={8}>
                  <Card title="样例文件目录"
                        extra={
                          <Button
                            type="primary"
                            onClick={this.handleShowCreateMockerDlg}
                            disabled={!couldCreateMocker}
                            icon={< CloudDownloadOutlined />}
                          >保存到项目中</Button>
                        }
                        style={{ minWidth: '300px' }}
                  >
                    <Tree.DirectoryTree
                      defaultExpandAll
                      defaultSelectedKeys={[selectedTreeKey]}
                      onSelect={this.handleSelectTree}
                      treeData={treeData}
                    />
                  </Card>
                </Col>

                <Col span={16}>
                  <Card title={`预览 ${(treeNode && treeNode.path)}`}
                        extra={<Button type="primary" onClick={() => {
                          this.handleDownload(treeNode);
                        }} icon={<DownloadOutlined />}>单独下载该文件</Button>}
                  >
                    <Input.TextArea
                      value={treeNode && treeNode.content}
                      placeholder="点击左侧目录树查看文件内容"
                      autoSize={{ minRows: 3 }}
                    />
                  </Card>
                </Col>
              </>
            ) : null
          }
        </Row>


        {
          isShowCreateMockerDlg ? (
            <CreateMockerDlg
              businessMocker={businessMocker}
              mockStarInfo={mockStarInfo}
              changeShowCreateMockerDlg={this.changeShowCreateMockerDlg}
              handleCreateMocker={this.handleCreateMocker}
            />
          ) : null
        }

      </div>
    );
  }
}
