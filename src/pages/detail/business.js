const urlParse = require('url-parse');
const ejs = require('ejs');

const dataGet = {
  request: {
    method: 'GET',
    resourceType: 'xhr',
    url: 'https://now.qq.com/cgi-bin/now/pc/user/get_user_follow_ts?bkn=1418269854&_=0.2717764620560481',
  },
  response: {
    body: '{"retcode":0,"result":{"ret_info":{"err_code":0},"anchor_info":[{"cover_url":"http://p.qlogo.cn/hy_personal_room/1211120615/12111206151598069165/640","audience_sum":33,"sdkType":1,"sign_name":"🦋涅槃重生","nick_name":"🦋小恋er。回归","frame_cover_url":null,"room_city":"上海市","videoBeginTimestamp":1598166995,"anchor_logo_url":"https://nowpic.gtimg.com/hy_personal/18aeb610f30b4e4d23b6c34fc9cb4859d3d8ba8bc36a7b6918c3bb8b0a8ee436670218ffd1392fab/","room_name":"","room_id":1211120615,"start_time":1598166995,"content_type":0}]}}',
    status: 200,
  },
};

const dataPost = {
  request: {
    method: 'POST',
    resourceType: 'xhr',
    url: 'https://live.rtc.qq.com:8687/api/uploadlog',
  },
  response: {
    body: '{"errode":0,"errmsg":"succ!"}',
    status: 200,
  },
};

function createFolderTree(network) {
  const url = network.request.url;
  const method = network.request.method;
  const data = JSON.parse(network.response.body);

  const mockerName = getMockerName(network.request.url);

  const treeNodeMap = {};

  // mocker
  const treeNodeFolderMocker = getTreeNodeFolder('mocker', mockerName, mockerName);
  treeNodeMap[treeNodeFolderMocker.key] = treeNodeFolderMocker;

  // base.js
  const treeNodeBaseJs = getTreeNodeBaseJs(network, treeNodeMap);
  treeNodeMap[treeNodeBaseJs.key] = treeNodeBaseJs;

  // config.json
  const treeNodeConfigJson = getTreeNodeConfigJson(network, treeNodeMap);
  treeNodeMap[treeNodeConfigJson.key] = treeNodeConfigJson;

  // index.js
  const treeNodeIndexJs = getTreeNodeIndexJs(network, treeNodeMap);
  treeNodeMap[treeNodeIndexJs.key] = treeNodeIndexJs;

  // mocker/mock_modules
  const treeNodeFolderMockModules = getTreeNodeFolder('mockModules', 'mock_modules', `${treeNodeFolderMocker.path}/mock_modules`);
  treeNodeMap[treeNodeFolderMockModules.key] = treeNodeFolderMockModules;

  // mocker/mock_modules/success
  const treeNodeFolderMockModulesSuccess = getTreeNodeFolder('mockModulesSuccess', 'success', `${treeNodeFolderMockModules.path}/success`);
  treeNodeMap[treeNodeFolderMockModulesSuccess.key] = treeNodeFolderMockModulesSuccess;

  // mocker/mock_modules/success/index.js
  const treeNodeMockModulesSuccessIndexJs = getTreeNodeMockModulesSuccessIndexJs(network, treeNodeMap);
  treeNodeMap[treeNodeMockModulesSuccessIndexJs.key] = treeNodeMockModulesSuccessIndexJs;

  // mocker/mock_modules/success/config.json
  const treeNodeMockModulesSuccessConfigJson = getTreeNodeMockModulesSuccessConfigJson(network, treeNodeMap);
  treeNodeMap[treeNodeMockModulesSuccessConfigJson.key] = treeNodeMockModulesSuccessConfigJson;

  const treeData = [
    {
      title: treeNodeFolderMocker.title,
      key: treeNodeFolderMocker.key,
      children: [{
        title: treeNodeBaseJs.title,
        key: treeNodeBaseJs.key,
        isLeaf: treeNodeBaseJs.isLeaf,
      }, {
        title: treeNodeConfigJson.title,
        key: treeNodeConfigJson.key,
        isLeaf: treeNodeConfigJson.isLeaf,
      }, {
        title: treeNodeIndexJs.title,
        key: treeNodeIndexJs.key,
        isLeaf: treeNodeIndexJs.isLeaf,
      }, {
        title: treeNodeFolderMockModules.title,
        key: treeNodeFolderMockModules.key,
        children: [
          {
            title: treeNodeFolderMockModulesSuccess.title,
            key: treeNodeFolderMockModulesSuccess.key,
            children: [
              {
                title: treeNodeMockModulesSuccessIndexJs.title,
                key: treeNodeMockModulesSuccessIndexJs.key,
                isLeaf: treeNodeMockModulesSuccessIndexJs.isLeaf,
              }, {
                title: treeNodeMockModulesSuccessConfigJson.title,
                key: treeNodeMockModulesSuccessConfigJson.key,
                isLeaf: treeNodeMockModulesSuccessConfigJson.isLeaf,
              },
            ],
          },
          {
            title: 'some-other',
            key: 'mockModulesSomeOther',
            children: [
              {
                title: 'index.js',
                key: 'mockModulesSomeOtherIndexJs',
                isLeaf: true,
              }, {
                title: 'config.json',
                key: 'mockModulesSomeOtherConfigJson',
                isLeaf: true,
              },
            ],
          },
        ],
      },
      ],
    },
  ];

  return { treeData, treeNodeMap };
}

function getMockerName(url) {
  const urlParseResult = urlParse(url);
  const pathnameArr = urlParseResult.pathname.split('/').filter(item => item.length);
  return pathnameArr[pathnameArr.length - 1];
}

function getTreeNodeFolder(key, title, path) {
  return {
    key,
    title,
    path,
  };
}

// base.js
function getTreeNodeBaseJs(network, treeNodeMap) {
  return {
    title: 'base.js',
    key: 'baseJs',
    isLeaf: true,
    path: `${treeNodeMap.mocker.path}/base.js`,
    content: ejs.render(require('./tpl_modules/base.js.ejs.js'), {}),
  };
}

// config.json
function getTreeNodeConfigJson(network, treeNodeMap) {
  const url = network.request.url;
  const method = network.request.method;
  const urlParseResult = urlParse(url);

  const data = {
    'description': `description for ${treeNodeMap.mocker.title}`,
    'route': urlParseResult.pathname,
    'defaultModule': 'success',
    'method': method,
    'tags': [
      'tag1',
      'tag2',
      method,
    ],
  };

  return {
    title: 'config.json',
    key: 'configJson',
    isLeaf: true,
    path: `${treeNodeMap.mocker.path}/config.json`,
    content: ejs.render(require('./tpl_modules/config.json.ejs.js'), { data }),
  };
}

// index.js
function getTreeNodeIndexJs(network, treeNodeMap) {
  return {
    title: 'index.js',
    key: 'indexJs',
    isLeaf: true,
    path: `${treeNodeMap.mocker.path}/index.js`,
    content: ejs.render(require('./tpl_modules/index.js.ejs.js'), {}),
  };
}

// mocker/mock_modules/success/index.js
function getTreeNodeMockModulesSuccessIndexJs(network, treeNodeMap) {
  const data = JSON.parse(network.response.body);

  return {
    title: 'index.js',
    key: 'mockModulesSuccessIndexJs',
    isLeaf: true,
    path: `${treeNodeMap.mockModulesSuccess.path}/index.js`,
    content: ejs.render(require('./tpl_modules/mock_modules/success/index.js.ejs.js'), { data }),
  };
}

// mocker/mock_modules/success/config.json
function getTreeNodeMockModulesSuccessConfigJson(network, treeNodeMap) {
  const data = {
    'description': `description_${treeNodeMap.mockModulesSuccess.title}`,
  };

  return {
    title: 'config.json',
    key: 'mockModulesSuccessConfigJson',
    isLeaf: true,
    path: `${treeNodeMap.mockModulesSuccess.path}/config.json`,
    content: ejs.render(require('./tpl_modules/mock_modules/success/config.json.ejs.js'), { data }),
  };
}

export { createFolderTree };
// console.log(JSON.stringify(createFolderTree(dataGet), null, 2));
//
// console.log(typeof require('./tpl_modules/base.js.ejs'))
