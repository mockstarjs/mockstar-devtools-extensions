const path = require('path');
const shelljs = require('shelljs');
const fse = require('fs-extra');
const ChromeExtension = require('crx');
const compressing = require('compressing');

const workspaceRootPath = path.join(__dirname, '../');
const chromePublicSrcPath = path.join(workspaceRootPath, 'chrome/public');
const unzipOutputPath = path.join(workspaceRootPath, 'chrome-extensions');
const releaseRootPath = path.join(workspaceRootPath, 'release');

const pkgInfo = require('../package.json');

/**
 * 构建 Create-React-App 项目
 * @param {String} projectRoot 项目根目录
 * @param {String} projectName 项目名
 */
function buildCRAProject(projectRoot, projectName) {
  const currentProjectRoot = projectRoot;
  const currentProjectBuildPath = path.join(currentProjectRoot, 'build');
  const currentProjectOutputPath = path.join(unzipOutputPath, projectName);

  // 清空产物输出文件夹
  fse.removeSync(currentProjectOutputPath);

  // 创建产物输出文件夹
  fse.ensureDirSync(currentProjectOutputPath);

  // 是否在构建之前需要执行 install
  const NPM = process.env.RUN_NPM_INSTALL;

  // install
  if (NPM) {
    shelljs.exec(`${NPM} i`, { cwd: currentProjectRoot });
  }

  // 构建
  shelljs.exec('npm run build', { cwd: currentProjectRoot });

  // copy 构建之后的放置到对应子目录下
  fse.copySync(currentProjectBuildPath, currentProjectOutputPath);
}

/**
 * 生成打包 chrome extensions 文件
 * https://www.npmjs.com/package/crx
 *
 * @param {String} sourceDir 待打包的文件路径
 */
function generateCrx(sourceDir, outputCrxPath) {
  const crx = new ChromeExtension({
    privateKey: fse.readFileSync(path.join(__dirname, './key.pem')),
  });

  crx.load(sourceDir)
    .then(crx => crx.pack())
    .then(crxBuffer => {
      fse.outputFileSync(outputCrxPath, crxBuffer);
    })
    .catch(err => {
      console.error(err);
    });
}

/**
 * 压缩指定的文件夹
 *
 * @param {String} sourceDir
 * @param {String} outputZipPath
 * @return {Promise<*>}
 */
async function compress(sourceDir, outputZipPath) {
  // 如果该目录下已经存在该文件，则删除，避免重复打包
  if (fse.pathExistsSync(outputZipPath)) {
    fse.removeSync(outputZipPath);
  }

  // 待打包的目录
  const source = sourceDir;

  // 临时目录，为避免和项目中文件夹重名，使用一个随机的文件夹名字
  const tmpDir = path.join(source, `../tmp_${Date.now()}`);

  // 临时拷贝待打包的目录，以 outputPath 名，注意需要去掉.号，避免 mac 等系统默认看不到解压文件
  const tmpZipFolderPath = path.join(tmpDir, path.basename(sourceDir).replace(/\./gi, ''));

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

/**
 * 更新 manifest.json 中的版本
 *
 * @param {String} version 新的版本号
 */
function updateManifestJsonVersion(version) {
  const manifestJsonOriginalFilePath = path.join(chromePublicSrcPath, 'manifest.json');
  const manifestJsonFilePath = path.join(unzipOutputPath, 'manifest.json');
  const manifestJson = fse.readJsonSync(manifestJsonOriginalFilePath);

  if (version) {
    manifestJson.version = version;
  }

  fse.writeJsonSync(manifestJsonFilePath, manifestJson);
}

module.exports = {
  workspaceRootPath,
  chromePublicSrcPath,
  unzipOutputPath,
  releaseRootPath,
  pkgInfo,
  buildCRAProject,
  compress,
  generateCrx,
  updateManifestJsonVersion,
};
