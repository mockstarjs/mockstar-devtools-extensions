import React, { Component } from 'react';
import { Button, Card, Col, Input, Row, Tree } from 'antd';

import axios from 'axios';

import CreateMockerDlg from './create-mocker-dlg';

import { createFolderTree, downloadSampleCode } from '../../business';

import './index.less';

export default class MockStarSample extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      selectedTreeKey: 'mockModulesDebugIndexJs',
      isShowCreateMockerDlg: false,
      mockServerPath: '',
      isMockStarNotStarted: false,
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
    axios.get('http://127.0.0.1:9527/mockstar-cgi/detail')
      .then((res) => {
        console.log(res);

        const { mockServerPath } = res.data.config;

        this.setState({
          mockServerPath,
          isShowCreateMockerDlg: true,
          isMockStarNotStarted: false,
        });

        // this.formRef.current.setFieldsValue({
        //   parentPath: mockServerPath
        // });
      })
      .catch((err) => {
        console.error(1111, err);

        this.setState({
          isShowCreateMockerDlg: true,
          isMockStarNotStarted: true,
        });
      });
  };

  handleCreateMocker = queryData => {
    // 获得 requestURL
    let requestURL = `http://127.0.0.1:9527/mockstar-cgi/create-mocker`;

    console.log(`准备发送请求：${JSON.stringify(queryData)}`);

    return axios.post(requestURL, queryData)
      .then(res => {
        const { data } = res;

        if (process.env.NODE_ENV !== 'production') {
          console.log(`url=${requestURL}`, queryData, data);
        }

        if (data.status === 200) {
          console.log(data, 'success');
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
    const { selectedTreeKey, isShowCreateMockerDlg, mockServerPath } = this.state;
    const { currentNetwork } = this.props;

    const { treeData, treeNodeMap, businessMocker } = createFolderTree(currentNetwork);
    const treeNode = treeNodeMap[selectedTreeKey];

    return (
      <div className="page-detail-mockstar-sample">
        <Row>
          <Col span={8}>
            <Card title="推荐文件目录"
                  extra={
                    <Button type="primary" onClick={this.handleShowCreateMockerDlg}>保存到项目中</Button>
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
                  }}>单独下载该文件</Button>}
            >
              <Input.TextArea
                value={treeNode && treeNode.content}
                placeholder="点击左侧目录树查看文件内容"
                autoSize={{ minRows: 3 }}
              />
            </Card>
          </Col>
        </Row>


        {
          isShowCreateMockerDlg ? (
            <CreateMockerDlg
              businessMocker={businessMocker}
              mockServerPath={mockServerPath}
              changeShowCreateMockerDlg={this.changeShowCreateMockerDlg}
              handleCreateMocker={this.handleCreateMocker}
            />
          ) : null
        }

      </div>
    );
  }
}
