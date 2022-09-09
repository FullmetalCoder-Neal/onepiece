module.exports = {
  presets: ['@vue/cli-plugin-babel/preset'],
  plugins: [
    [
      'import',
      {
        'libraryName': 'd-ui-vue2',
        style: (name) => {
          return `${name}/style.css`
        }
      }
    ]
  ]
}
