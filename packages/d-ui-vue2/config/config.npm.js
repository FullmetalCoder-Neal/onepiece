// config.npm.js
const { resolve, getComponentEntries } = require('./utils')

const npmBuildConfig = {
  // 输出文件目录
  outputDir: resolve('lib'),
  // webpack配置
  configureWebpack: {
    //  入口文件
    entry: getComponentEntries('packages'),
    //  输出配置 按需引入的关键。。。。
    output: {
      //  文件名称
      filename: '[name]/index.js',
      //  构建依赖类型
      libraryTarget: 'umd',
      umdNamedDefine: false,
      //  依赖输出
      libraryExport: 'default',
      //  依赖名称
      library: 'd-zui-vue2'
    },
  },
  //  样式输出
  css: {
    sourceMap: true,
    extract: {
      filename: '[name]/style.css'
    }
  },
  chainWebpack: config => {
    config.optimization.delete('splitChunks')
    config.plugins.delete('copy')
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
    config.plugins.delete('html')
    config.plugins.delete('hmr')
    config.entryPoints.delete('app')
  },
  productionSourceMap: false,
}

module.exports = npmBuildConfig