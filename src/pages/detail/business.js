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

  const treeMap = {};

  // mocker
  const contentMocker = getContentMocker(network);
  treeMap[contentMocker.key] = contentMocker;

  // base.js
  const contentBaseJs = getContentBaseJs(network, treeMap);
  treeMap[contentBaseJs.key] = contentBaseJs;

  // config.json
  const contentConfigJson = getContentConfigJson(network, treeMap);
  treeMap[contentConfigJson.key] = contentConfigJson;

  // index.json
  const contentIndexJs = getContentIndexJs(network, treeMap);
  treeMap[contentIndexJs.key] = contentIndexJs;

  const treeData = [
    {
      title: contentMocker.title,
      key: contentMocker.key,
      children: [
        { title: contentBaseJs.title, key: contentBaseJs.key, isLeaf: contentBaseJs.isLeaf },
        { title: contentConfigJson.title, key: contentConfigJson.key, isLeaf: contentConfigJson.isLeaf },
        { title: contentIndexJs.title, key: contentIndexJs.key, isLeaf: contentIndexJs.isLeaf },
        {
          title: 'mock_modules',
          key: 'mockModules',
          children: [
            {
              title: 'success',
              key: 'mockModulesSuccess',
              children: [
                {
                  title: 'index.js',
                  key: 'mockModulesSuccessIndexJs',
                  isLeaf: true,
                }, {
                  title: 'config.json',
                  key: 'mockModulesSuccessConfigJson',
                  isLeaf: true,
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

  return { treeData, treeMap };
}

function getMockerName(url) {
  const urlParseResult = urlParse(url);
  const pathnameArr = urlParseResult.pathname.split('/').filter(item => item.length);
  return pathnameArr[pathnameArr.length - 1];
}

function getContentMocker(network, treeMap) {
  const mockerName = getMockerName(network.request.url);

  return {
    title: mockerName,
    key: 'mocker',
    path: mockerName,
  };
}

function getContentIndexJs(network, treeMap) {
  return {
    title: 'index.js',
    key: 'indexJs',
    isLeaf: true,
    path: `${treeMap.mocker.path}/index.js`,
    content: ejs.render(require('./tpl_modules/index.js.ejs.js'), {}),
  };
}

function getContentConfigJson(network, treeMap) {
  const url = network.request.url;
  const method = network.request.method;
  const urlParseResult = urlParse(url);

  return {
    title: 'config.json',
    key: 'configJson',
    isLeaf: true,
    path: `${treeMap.mocker.path}/config.json`,
    content: ejs.render(require('./tpl_modules/config.json.ejs.js'), {
      data: {
        'description': `description for ${treeMap.mocker.title}`,
        'route': urlParseResult.pathname,
        'defaultModule': 'success',
        'method': method,
        'tags': [
          'tag1',
          'tag2',
          method,
        ],
      },
    }),
  };
}

function getContentBaseJs(network, treeMap) {
  return {
    title: 'base.js',
    key: 'baseJs',
    isLeaf: true,
    path: `${treeMap.mocker.path}/base.js`,
    content: ejs.render(require('./tpl_modules/base.js.ejs.js'), {}),
  };
}

export { createFolderTree };
// console.log(JSON.stringify(createFolderTree(dataGet), null, 2));
//
// console.log(typeof require('./tpl_modules/base.js.ejs'))
