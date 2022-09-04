// vue.config.js 
// 根据不同打包命令使用不同打包文件
const demoBuildConfig = require('./config/config.demo')
const npmBuildConfig = require('./config/config.npm')

module.exports = process.env.ENV === 'npm' ? npmBuildConfig : demoBuildConfig

