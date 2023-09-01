/* eslint-disable @typescript-eslint/no-var-requires */

const path = require('path')
const { PORT } = require('./src/constants/mocker')

class HTTPMockerPlugin {
  apply(compiler) {
    let started = false
    compiler.hooks.done.tapAsync('HTTPMockerPlugin', (stats, callback) => {
      if (!started) {
        started = true
        if (process.env.VUE_APP_ENV === 'mock') {
          const express = require('express')
          const mockerAPI = require('mocker-api')
          const app = express()
          app.listen(PORT, () => {
            console.log(`\nhttp mocker listening at http://localhost:${PORT}\n`)
            mockerAPI(app, path.resolve(__dirname, './src/mock/index.js'), {
              priority: 'mocker',
              proxy: {
                '/base/(.*)': 'http://alpha-api.xxx.com'
              },
              pathRewrite: {
                '^/base/': ''
              }
            })
          })
        }
      }
      callback()
    })
  }
}

module.exports = {
  transpileDependencies: ['@dcloudio/uni-ui', 'uview-ui'],
  configureWebpack: {
    plugins:
      process.env.NODE_ENV === 'development' ? [new HTTPMockerPlugin()] : []
  }
}
