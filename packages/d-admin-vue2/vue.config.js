'use strict'
const path = require('path')
const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'Fullmetal Admin' // page title

// 1024以下的端口需要root权限
const port = 9528

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    open: true,
    host: 'localhost',
    /**
     * webpack4
     * @description: 提供了一个在 devServer 内部的 所有中间件执行之前的自定义执行函数
     * @param {*} app: express对象
     * @param {*} server: webpack-dev-server
     * @param {*} compiler: webpack编译器
     * @return {*}
     */
    // before: (app, server, compiler) => {}
    /**
     * webpack5
     * @description: 提供执行自定义函数和应用自定义中间件的能力
     * @param {*} middlewares: 中间件列表
     * @param {*} devServer: devServer.app: express对象
     * @return {*} 
     */      
    // setupMiddlewares: (middlewares, devServer) => {}
    setupMiddlewares: require('./mock/mock-server.js')
    // proxy: {
    //   '/dev-api': {
    //     target: '',
    //     changeOrigin: true,
    //     ws: false,
    //     pathRewrite: {
    //       '^/dev-api': ''
    //     }
    //   }
    // }
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    }
  },
  chainWebpack(config) {
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // FIXME vue-cli not support preload for now with upgrading to webpack5
    // config.plugin('preload').tap(() => [
    //   {
    //     rel: 'preload',
    //     // to ignore runtime.js
    //     // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
    //     fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
    //     include: 'initial'
    //   }
    // ])

    // when there are many pages, it will cause too many meaningless requests
    // config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg')// 修改基础loader，防止默认的svg loader处理svg文件
      .exclude.add(resolve('src/icons'))
      .end()
    config.module
      .rule('icons')// 自定义svg loader
      .test(/\.svg$/)
      .include.add(resolve('src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end()

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .plugin('ScriptExtHtmlWebpackPlugin')
            .after('html')
            .use('script-ext-html-webpack-plugin', [{
              // `runtime` must same as runtimeChunk name. default is `runtime`
              inline: /runtime\..*\.js$/
            }])
            .end()
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                // elementUI: {
                //   name: 'chunk-elementUI', // split elementUI into a single package
                //   priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                //   test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                // },
                commons: {
                  name: 'chunk-commons',
                  test: resolve('src/components'), // can customize your rules
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          // https://webpack.js.org/configuration/optimization/#optimizationruntimechunk
          // 将runtimeChunk单独打包成一个文件
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
