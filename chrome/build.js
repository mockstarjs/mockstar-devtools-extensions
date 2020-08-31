const path = require('path');
const fse = require('fs-extra');

const {
  workspaceRootPath,
  chromePublicSrcPath,
  unzipOutputPath,
  releaseRootPath,
  pkgInfo,
  compress,
  generateCrx,
  buildCRAProject,
  updateManifestJsonVersion,
} = require('./build-helper');

(async () => {
  // 清空产物输出文件夹
  fse.removeSync(unzipOutputPath);
  fse.removeSync(releaseRootPath);

  // 创建产物输出文件夹
  fse.ensureDirSync(unzipOutputPath);
  fse.ensureDirSync(releaseRootPath);

  // 复制 chrome devtools extensions 的一些公共文件
  fse.copySync(chromePublicSrcPath, unzipOutputPath);

  // 打包 Create-React-App 项目
  buildCRAProject(workspaceRootPath, 'mockstar');

  // 更新 manifest.json 中的版本
  updateManifestJsonVersion(pkgInfo.version);

  // 打包 crx
  generateCrx(unzipOutputPath, path.join(releaseRootPath, `MockStar-Chrome-Extensions-v${pkgInfo.version}.crx`));

  // 压缩一个 zip 包
  await compress(unzipOutputPath, path.join(releaseRootPath, `MockStar-Chrome-Extensions-v${pkgInfo.version}.zip`));
})();
