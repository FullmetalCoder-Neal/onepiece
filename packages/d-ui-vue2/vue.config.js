// vue.config.js 
// 根据不同打包命令使用不同打包文件
const npmBuildConfig = require('./config/config.npm')

module.exports = process.env.ENV === 'npm' ? npmBuildConfig : {}

