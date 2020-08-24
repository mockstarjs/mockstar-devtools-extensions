const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');
const walkSync = require('walk-sync');

const TPL_PATH = path.join(__dirname, '../src/pages/detail/tpl');
const OUTPUT_PATH = path.join(path.dirname(TPL_PATH), 'tpl_modules');

const paths = walkSync.entries(TPL_PATH);

console.log(paths, OUTPUT_PATH);

paths.forEach((entry) => {
  const curPath = path.join(entry.basePath, entry.relativePath);
  const outputPath = path.join(OUTPUT_PATH, entry.relativePath);

  if (entry.isDirectory()) {
    // 如果是文件夹，则直接穿甲
    fse.ensureDirSync(outputPath);
  } else {
    // 如果是文件，则追加一个 .js 后缀，且修改为 js 模块
    const content = fse.readFileSync(curPath, 'utf8');
    const moduleContent = 'module.exports = `\n' + content + '\n`;';

    fse.outputFileSync(`${outputPath}.js`, moduleContent);
  }
});
