const urlParse = require('url-parse');
const ejs = require('ejs');

const treeNodeMapJson = require('./tpl_modules/tree-node-map.json');
const tplModules = require('./tpl_modules');

function createFolderTree(network) {
  const mockerName = getMockerName(network.request.url);
  const method = network.request.method;
  const urlParseResult = urlParse(network.request.url);

  const mockerConfig = {
    config: {
      description: `description for ${mockerName}`,
      name: mockerName,
      route: urlParseResult.pathname,
      method: method,
      debugMockModuleJsonData: network.response.jsonData,
    },
  };

  const treeNodeMap = getTreeNodeMap(treeNodeMapJson, mockerConfig);

  const treeData = [{
    ...treeNodeMap.rootNode,
    title: mockerName,
    children: [
      treeNodeMap.indexJs,
      treeNodeMap.configJson,
      treeNodeMap.baseJs,
      treeNodeMap.rEADMEMd,
      {
        ...treeNodeMap.mockModules,
        children: [{
          ...treeNodeMap.mockModulesDebug,
          children: [
            treeNodeMap.mockModulesDebugConfigJson,
            treeNodeMap.mockModulesDebugIndexJs,
          ],
        }, {
          ...treeNodeMap.mockModulesError100000,
          children: [
            treeNodeMap.mockModulesError100000ConfigJson,
            treeNodeMap.mockModulesError100000IndexJs,
          ],
        }, {
          ...treeNodeMap.mockModulesSuccessJsModule,
          children: [
            treeNodeMap.mockModulesSuccessJsModuleConfigJson,
            treeNodeMap.mockModulesSuccessJsModuleIndexJs,
          ],
        },
          treeNodeMap.mockModulesSuccessJsonFileJson,
        ],
      }, {
        ...treeNodeMap.static,
        children: [{
          ...treeNodeMap.staticSub,
          children: [
            treeNodeMap.staticSubSomeWorkflowPng,
          ],
        },
          treeNodeMap.staticSomeDescribPng,
        ],
      }],
  }];

  return { treeData, treeNodeMap };
}

function getMockerName(url) {
  const urlParseResult = urlParse(url);
  const pathnameArr = urlParseResult.pathname.split('/').filter(item => item.length);
  return pathnameArr[pathnameArr.length - 1];
}

function getTreeNodeMap(treeNodeMapJson, mockerConfig) {
  const map = {};

  for (const treeNodeMapJsonKey in treeNodeMapJson) {
    const curItem = treeNodeMapJson[treeNodeMapJsonKey];
    if (curItem.isLeaf && curItem.contentModuleName) {
      curItem.content = ejs.render(tplModules[curItem.contentModuleName], { mockerConfig });
    }

    map[treeNodeMapJsonKey] = curItem;
  }

  return map;
}

function downloadSampleCode(content, filename) {
  const eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';

  // 字符内容转变成blob地址
  const blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);

  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();

  // 然后移除
  document.body.removeChild(eleLink);
}

export { createFolderTree, downloadSampleCode };
