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

  // mocker/mock_modules/debug
  const treeNodeFolderMockModulesDebug = getTreeNodeFolder('mockModulesDebug', 'debug', `${treeNodeFolderMockModules.path}/debug`);
  treeNodeMap[treeNodeFolderMockModulesDebug.key] = treeNodeFolderMockModulesDebug;

  // mocker/mock_modules/debug/index.js
  const treeNodeMockModulesDebugIndexJs = getTreeNodeMockModulesDebugIndexJs(network, treeNodeMap);
  treeNodeMap[treeNodeMockModulesDebugIndexJs.key] = treeNodeMockModulesDebugIndexJs;

  // mocker/mock_modules/debug/config.json
  const treeNodeMockModulesDebugConfigJson = getTreeNodeMockModulesDebugConfigJson(network, treeNodeMap);
  treeNodeMap[treeNodeMockModulesDebugConfigJson.key] = treeNodeMockModulesDebugConfigJson;

  // mocker/mock_modules/success_other
  const treeNodeFolderMockModulesSuccessOther = getTreeNodeFolder('mockModulesSuccessOther', 'success_other', `${treeNodeFolderMockModules.path}/success_other`);
  treeNodeMap[treeNodeFolderMockModulesSuccessOther.key] = treeNodeFolderMockModulesSuccessOther;

  // mocker/mock_modules/success_other/index.js
  const treeNodeMockModulesSuccessOtherIndexJs = getTreeNodeMockModulesSuccessOtherIndexJs(network, treeNodeMap);
  treeNodeMap[treeNodeMockModulesSuccessOtherIndexJs.key] = treeNodeMockModulesSuccessOtherIndexJs;

  // mocker/mock_modules/success_other/config.json
  const treeNodeMockModulesSuccessOtherConfigJson = getTreeNodeMockModulesSuccessOtherConfigJson(network, treeNodeMap);
  treeNodeMap[treeNodeMockModulesSuccessOtherConfigJson.key] = treeNodeMockModulesSuccessOtherConfigJson;

  // mocker/mock_modules/error_100000
  const treeNodeFolderMockModulesError100000 = getTreeNodeFolder('mockModulesError100000', 'error_100000', `${treeNodeFolderMockModules.path}/error_100000`);
  treeNodeMap[treeNodeFolderMockModulesError100000.key] = treeNodeFolderMockModulesError100000;

  // mocker/mock_modules/error_100000/index.js
  const treeNodeMockModulesError100000IndexJs = getTreeNodeMockModulesError100000IndexJs(network, treeNodeMap);
  treeNodeMap[treeNodeMockModulesError100000IndexJs.key] = treeNodeMockModulesError100000IndexJs;

  // mocker/mock_modules/error_100000/config.json
  const treeNodeMockModulesError100000ConfigJson = getTreeNodeMockModulesError100000ConfigJson(network, treeNodeMap);
  treeNodeMap[treeNodeMockModulesError100000ConfigJson.key] = treeNodeMockModulesError100000ConfigJson;

  const treeData = [{
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
      children: [{
        title: treeNodeFolderMockModulesDebug.title,
        key: treeNodeFolderMockModulesDebug.key,
        children: [
          {
            title: treeNodeMockModulesDebugIndexJs.title,
            key: treeNodeMockModulesDebugIndexJs.key,
            isLeaf: treeNodeMockModulesDebugIndexJs.isLeaf,
          }, {
            title: treeNodeMockModulesDebugConfigJson.title,
            key: treeNodeMockModulesDebugConfigJson.key,
            isLeaf: treeNodeMockModulesDebugConfigJson.isLeaf,
          },
        ],
      }, {
        title: treeNodeFolderMockModulesError100000.title,
        key: treeNodeFolderMockModulesError100000.key,
        children: [
          {
            title: treeNodeMockModulesError100000IndexJs.title,
            key: treeNodeMockModulesError100000IndexJs.key,
            isLeaf: treeNodeMockModulesError100000IndexJs.isLeaf,
          }, {
            title: treeNodeMockModulesError100000ConfigJson.title,
            key: treeNodeMockModulesError100000ConfigJson.key,
            isLeaf: treeNodeMockModulesError100000ConfigJson.isLeaf,
          },
        ],
      }, {
        title: treeNodeFolderMockModulesSuccessOther.title,
        key: treeNodeFolderMockModulesSuccessOther.key,
        children: [
          {
            title: treeNodeMockModulesSuccessOtherIndexJs.title,
            key: treeNodeMockModulesSuccessOtherIndexJs.key,
            isLeaf: treeNodeMockModulesSuccessOtherIndexJs.isLeaf,
          }, {
            title: treeNodeMockModulesSuccessOtherConfigJson.title,
            key: treeNodeMockModulesSuccessOtherConfigJson.key,
            isLeaf: treeNodeMockModulesSuccessOtherConfigJson.isLeaf,
          },
        ],
      }],
    }],
  }];

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

// mocker/mock_modules/debug/index.js
function getTreeNodeMockModulesDebugIndexJs(network, treeNodeMap) {
  const data = JSON.parse(network.response.body);

  return {
    title: 'index.js',
    key: 'mockModulesDebugIndexJs',
    isLeaf: true,
    path: `${treeNodeMap.mockModulesDebug.path}/index.js`,
    content: ejs.render(require('./tpl_modules/mock_modules/debug/index.js.ejs.js'), { data }),
  };
}

// mocker/mock_modules/debug/config.json
function getTreeNodeMockModulesDebugConfigJson(network, treeNodeMap) {
  const data = {
    'description': `description_${treeNodeMap.mockModulesDebug.title}`,
  };

  return {
    title: 'config.json',
    key: 'mockModulesDebugConfigJson',
    isLeaf: true,
    path: `${treeNodeMap.mockModulesDebug.path}/config.json`,
    content: ejs.render(require('./tpl_modules/mock_modules/debug/config.json.ejs.js'), { data }),
  };
}

// mocker/mock_modules/success_other/index.js
function getTreeNodeMockModulesSuccessOtherIndexJs(network, treeNodeMap) {
  return {
    title: 'index.js',
    key: 'mockModulesSuccessOtherIndexJs',
    isLeaf: true,
    path: `${treeNodeMap.mockModulesSuccessOther.path}/index.js`,
    content: ejs.render(require('./tpl_modules/mock_modules/success_other/index.js.ejs.js'), {}),
  };
}

// mocker/mock_modules/success_other/config.json
function getTreeNodeMockModulesSuccessOtherConfigJson(network, treeNodeMap) {
  const data = {
    'description': `description_${treeNodeMap.mockModulesSuccessOther.title}`,
  };

  return {
    title: 'config.json',
    key: 'mockModulesSuccessOtherConfigJson',
    isLeaf: true,
    path: `${treeNodeMap.mockModulesSuccessOther.path}/config.json`,
    content: ejs.render(require('./tpl_modules/mock_modules/success_other/config.json.ejs.js'), { data }),
  };
}

// mocker/mock_modules/error_100000/index.js
function getTreeNodeMockModulesError100000IndexJs(network, treeNodeMap) {
  return {
    title: 'index.js',
    key: 'mockModulesError100000IndexJs',
    isLeaf: true,
    path: `${treeNodeMap.mockModulesError100000.path}/index.js`,
    content: ejs.render(require('./tpl_modules/mock_modules/error_100000/index.js.ejs.js'), {}),
  };
}

// mocker/mock_modules/error_100000/config.json
function getTreeNodeMockModulesError100000ConfigJson(network, treeNodeMap) {
  const data = {
    'description': `description_${treeNodeMap.mockModulesError100000.title}`,
  };

  return {
    title: 'config.json',
    key: 'mockModulesError100000ConfigJson',
    isLeaf: true,
    path: `${treeNodeMap.mockModulesError100000.path}/config.json`,
    content: ejs.render(require('./tpl_modules/mock_modules/error_100000/config.json.ejs.js'), { data }),
  };
}

export { createFolderTree };
// console.log(JSON.stringify(createFolderTree(dataGet), null, 2));
//
// console.log(typeof require('./tpl_modules/base.js.ejs'))
