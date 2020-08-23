const {
    override,
    fixBabelImports,
    addLessLoader,
    addWebpackAlias
} = require('customize-cra');
const path = require('path');

module.exports = override(
    fixBabelImports('antd', {
        style: 'css'
    }),
    fixBabelImports('ant-design-pro', {
        libraryDirectory: 'lib',
        style: 'css',
        camel2DashComponentName: false
    }),
    addLessLoader({
        strictMath: true,
        noIeCompat: true,
        javascriptEnabled: true,
        localIdentName: '[local]--[hash:base64:5]'
    }),
    addWebpackAlias({
        '@': path.join(__dirname, 'src')
    })
);