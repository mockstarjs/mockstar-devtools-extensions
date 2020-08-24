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
    fse.ensureDirSync(outputPath);
  } else {
    const content = fse.readFileSync(curPath, 'utf8');
    const moduleContent = 'module.exports=`\n' + content + '\n`';
    fse.outputFileSync(outputPath, moduleContent);
  }
});
