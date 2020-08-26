const fs = require('fs');
const path = require('path');
const shelljs = require('shelljs');
const fse = require('fs-extra');
const ChromeExtension = require('crx');

const pkgInfo = require('../package.json');

const workspaceRootPath = path.join(__dirname, '../');
const chromePublicSrcPath = path.join(workspaceRootPath, 'chrome/public');
const unzipOutputPath = path.join(workspaceRootPath, 'chrome-extensions');
const releaseRootPath = path.join(workspaceRootPath, 'release');

(function () {
  // 创建文件夹
  fse.ensureDirSync(unzipOutputPath);

  // 删除文件
  shelljs.rm('-rf', unzipOutputPath);

  // 复制 devtools 的一些公共文件
  shelljs.cp('-r', chromePublicSrcPath, unzipOutputPath);

  // 执行构建
  shelljs.exec('npm run build', { cwd: workspaceRootPath });

  // copy 构建之后的放置到 mockstar 子目录下
  shelljs.cp(
    '-r',
    path.join(workspaceRootPath, 'build'),
    path.join(unzipOutputPath, 'mockstar'),
  );

  // 更新 manifest.json 中的版本
  const manifestJsonOriginalFilePath = path.join(chromePublicSrcPath, 'manifest.json');
  const manifestJsonFilePath = path.join(unzipOutputPath, 'manifest.json');
  const manifestJson = fse.readJsonSync(manifestJsonOriginalFilePath);
  manifestJson.version = pkgInfo.version;
  fse.writeJsonSync(manifestJsonFilePath, manifestJson);

  // 打包 crx
  generateCrx(unzipOutputPath);
})();

// https://www.npmjs.com/package/crx
function generateCrx(unzipOutputPath) {
  const crx = new ChromeExtension({
    privateKey: fse.readFileSync(path.join(__dirname, './key.pem')),
  });

  crx.load(unzipOutputPath)
    .then(crx => crx.pack())
    .then(crxBuffer => {
      fse.outputFileSync(path.join(releaseRootPath, `MockStar-Chrome-Extensions-v${pkgInfo.version}.crx`), crxBuffer);
    })
    .catch(err => {
      console.error(err);
    });
}

