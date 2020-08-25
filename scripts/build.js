const path = require('path');
const shelljs = require('shelljs');
const fse = require('fs-extra');
const pkgInfo = require('../package.json');

const projectRootPath = path.join(__dirname, '../');
const outputPath = path.join(projectRootPath, 'release', `v${pkgInfo.version}`);

(function () {
  // 创建文件夹
  fse.ensureDirSync(outputPath);

  // 删除文件
  shelljs.rm('-rf', outputPath);

  // 复制 devtools 的一些公共文件
  shelljs.cp('-r', path.join(projectRootPath, 'public_devtools'), outputPath);

  // 执行构建
  shelljs.exec('npm run build', { cwd: projectRootPath });

  // copy 构建之后的放置到 mockstar 子目录下
  shelljs.cp(
    '-r',
    path.join(projectRootPath, 'build'),
    path.join(outputPath, 'mockstar'),
  );

  // 更新 manifest.json 中的版本
  const manifestJsonOriginalFilePath = path.join(projectRootPath, 'public_devtools/manifest.json');
  const manifestJsonFilePath = path.join(outputPath, 'manifest.json');
  const manifestJson = fse.readJsonSync(manifestJsonOriginalFilePath);
  manifestJson.version = pkgInfo.version;
  fse.writeJsonSync(manifestJsonFilePath, manifestJson);
})();
