const urlParse = require('url-parse');
const ejs = require('ejs');

const treeNodeMapJson = require('./tpl_modules/tree-node-map.json');
const tplModules = require('./tpl_modules');

function createFolderTree(network) {
  const mockerName = getMockerName(network.request.url);
  const method = network.request.method;
  const urlParseResult = urlParse(network.request.url);

  const businessMocker = {
    config: {
      name: mockerName,
      route: urlParseResult.pathname,
      method: method,
    },
    debugMockModuleJsonData: network.response.jsonData,
  };

  const treeNodeMap = getTreeNodeMap(treeNodeMapJson, businessMocker);

  // 更新
  treeNodeMap.rootNode.title = mockerName;

  const treeData = [{
    ...treeNodeMap.rootNode,
    children: [
      treeNodeMap.indexJs,
      treeNodeMap.configJson,
      addExtraTag(treeNodeMap.baseJs),
      addExtraTag(treeNodeMap.rEADMEMd),
      {
        ...treeNodeMap.mockModules,
        children: [{
          ...treeNodeMap.mockModulesDebug,
          children: [
            treeNodeMap.mockModulesDebugConfigJson,
            treeNodeMap.mockModulesDebugIndexJs,
          ],
        }, {
          ...addExtraTag(treeNodeMap.mockModulesError100000),
          children: [
            addExtraTag(treeNodeMap.mockModulesError100000ConfigJson),
            addExtraTag(treeNodeMap.mockModulesError100000IndexJs),
          ],
        }, {
          ...addExtraTag(treeNodeMap.mockModulesSuccessJsModule),
          children: [
            addExtraTag(treeNodeMap.mockModulesSuccessJsModuleConfigJson),
            addExtraTag(treeNodeMap.mockModulesSuccessJsModuleIndexJs),
          ],
        },
          addExtraTag(treeNodeMap.mockModulesSuccessJsonFileJson),
        ],
      }, {
        ...addExtraTag(treeNodeMap.static),
        children: [{
          ...addExtraTag(treeNodeMap.staticSub),
          children: [
            addExtraTag(treeNodeMap.staticSubSomeWorkflowPng),
          ],
        },
          addExtraTag(treeNodeMap.staticSomeDescribPng),
        ],
      }],
  }];

  return { treeData, treeNodeMap, businessMocker };
}

function getMockerName(url) {
  const urlParseResult = urlParse(url);
  const pathnameArr = urlParseResult.pathname.split('/').filter(item => item.length);
  return pathnameArr[pathnameArr.length - 1];
}

function getTreeNodeMap(treeNodeMapJson, businessMocker) {
  const map = {};

  for (const treeNodeMapJsonKey in treeNodeMapJson) {
    const curItem = treeNodeMapJson[treeNodeMapJsonKey];
    if (curItem.isLeaf && curItem.contentModuleName) {
      curItem.content = ejs.render(tplModules[curItem.contentModuleName], { businessMocker });
    }

    map[treeNodeMapJsonKey] = curItem;
  }

  return map;
}

function addExtraTag(treeNode) {
  return { ...treeNode, className: 'extra-code' };
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
