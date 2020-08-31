const path = require('path');
const shelljs = require('shelljs');
const fse = require('fs-extra');
const ChromeExtension = require('crx');
const compressing = require('compressing');

const pkgInfo = require('../package.json');

const workspaceRootPath = path.join(__dirname, '../');
const chromePublicSrcPath = path.join(workspaceRootPath, 'chrome/public');
const unzipOutputPath = path.join(workspaceRootPath, 'chrome-extensions');
const releaseRootPath = path.join(workspaceRootPath, 'release');

(async () => {
  // 清空产物输出文件夹
  fse.removeSync(unzipOutputPath);
  fse.removeSync(releaseRootPath);

  // 创建产物输出文件夹
  fse.ensureDirSync(unzipOutputPath);
  fse.ensureDirSync(releaseRootPath);

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

  await compress(unzipOutputPath, path.join(releaseRootPath, `MockStar-Chrome-Extensions-v${pkgInfo.version}.zip`));
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

// 压缩
async function compress(outputPath, outputZipPath) {
  // 如果该目录下已经存在该文件，则删除，避免重复打包
  if (fse.pathExistsSync(outputZipPath)) {
    fse.removeSync(outputZipPath);
  }

  // 待打包的目录
  const source = outputPath;

  // 临时目录，为避免和项目中文件夹重名，使用一个随机的文件夹名字
  const tmpDir = path.join(source, `../tmp_${Date.now()}`);

  // 临时拷贝待打包的目录，以 outputPath 名，注意需要去掉.号，避免 mac 等系统默认看不到解压文件
  const tmpZipFolderPath = path.join(tmpDir, path.basename(outputPath).replace(/\./gi, ''));

  // 临时打包出来的文件
  const tmpOutputZipPath = path.join(tmpDir, path.basename(outputZipPath));

  // 将 source 复制到待打包目录
  fse.copySync(source, tmpZipFolderPath);

  // 将待打包目录压缩zip
  await compressing.zip.compressDir(tmpZipFolderPath, tmpOutputZipPath);

  // 然后再移动目的地
  fse.moveSync(tmpOutputZipPath, outputZipPath, {
    overwrite: true,
  });

  // 最后要注意清理掉临时目录
  fse.removeSync(tmpDir);

  return outputZipPath;
}
