const fse = require('fs-extra');
const path = require('path');
const walkSync = require('walk-sync');
const { getMockerGeneratorTemplatesRoot } = require('mockstar-generators');
const { camelize } = require('humps');

const TPL_PATH = getMockerGeneratorTemplatesRoot();
const OUTPUT_PATH = path.join(__dirname, '../src/pages/detail/tpl_modules');

const paths = walkSync.entries(TPL_PATH);

console.log(paths, OUTPUT_PATH);

const arr = [];

const treeNodeMap = {
  rootNode: {
    title: 'mocker title',
    key: 'mocker',
    selectable: false,
    isLeaf: false,
    isRoot: true,
  },
};
const tplIndexRequireArr = [];

paths.forEach((entry) => {
  const curPath = path.join(entry.basePath, entry.relativePath);
  const outputPath = path.join(OUTPUT_PATH, entry.relativePath);

  arr.push(entry.relativePath);

  // 使用相对路径，可以保证 key 是唯一的
  const treeNodeKey = getTreeNodeKey(entry.relativePath);
  const treeNode = {
    key: treeNodeKey,
    title: getTreeNodeTitle(entry.relativePath),
    path: getTreeNodePath(entry.relativePath),
  };

  if (entry.isDirectory()) {
    // 如果是文件夹，则直接穿甲
    fse.ensureDirSync(outputPath);

    treeNode.selectable = false;
    treeNode.isLeaf = false;
  } else {
    const extname = path.extname(curPath);
    treeNode.isLeaf = true;

    if (['.png', '.jpg', '.gif'].indexOf(extname) > -1) {
      // 如果是图片，则直接拷贝
      treeNode.selectable = false;
    } else {
      treeNode.selectable = true;
      // 如果是其他的，则则追加一个 .js 后缀，且修改为 js 模块
      const content = fse.readFileSync(curPath, 'utf8');
      const moduleContent = 'module.exports = `\n' + content + '\n`;';
      fse.outputFileSync(`${outputPath}.js`, moduleContent);

      // 记录 require
      tplIndexRequireArr.push(`${treeNodeKey}: require('./${entry.relativePath}.js')`);

      // 记录模块
      treeNode.contentModuleName = treeNodeKey;
    }
  }

  treeNodeMap[treeNodeKey] = treeNode;
});

// 保存 tplIndexRequireArr 到 index.js
fse.outputFileSync(path.join(OUTPUT_PATH, 'index.js'), `module.exports = {${tplIndexRequireArr.join(',')}}`);

// 保存一份 treeNodeMap
fse.outputJsonSync(path.join(OUTPUT_PATH, 'tree-node-map.json'), treeNodeMap);

console.log(arr);
console.log(treeNodeMap);
console.log(tplIndexRequireArr);

function getTreeNodeKey(relativePath) {
  const str = getTreeNodePath(relativePath)
    // linux 下的 / 修改为 _
    .replace(/\//gi, '_')

    // windows 下的 \\ 修改为 _
    .replace(/\\/gi, '_')
    .replace(/\\\\/gi, '_')

    // 将文件后缀的 . 修改为 _
    .replace(/\./gi, '_');

  return camelize(str);
}

function getTreeNodeTitle(relativePath) {
  const arr = getTreeNodePath(relativePath).split(path.sep);

  // 有可能是 mock_modules/debug/
  // 有可能是 mock_modules/debug/config.json
  return arr[arr.length - 1] || arr[arr.length - 2];
}

function getTreeNodePath(relativePath) {
  return relativePath.replace(/.ejs$/, '');
}
