const { mode } = require('webpack-nano/argv')
const { merge } = require('webpack-merge')
const parts = require('./webpack.parts')
const path = require('path')

const cssLoaders = [parts.autoprefix(), parts.tailwind()] // autoprefix(tailwind(input))

const commonConfig = ({ outputPath = '/dist' } = {}) => {
  return merge([
    { 
      entry: ["./src"], 
      // output: { 
      //   path: __dirname + outputPath
      // }
    },
    parts.page({ title: 'Demo' }),
    parts.extractCSS({ loaders: cssLoaders }),
    parts.loadImages({ limit: 15000 }),
    parts.loadFonts(),
    parts.loadTypeScript()
    // parts.loadJavaScript()
    // parts.extractCSS()
    // parts.loadCSS()
  ])

}

const productionConfig = merge([])

// const productionConfig = merge([
//   { mode: 'production' }
// ])

const developmentConfig = merge([
  { entry: ["webpack-plugin-serve/client"] },
  parts.devServer()
])

const getConfig = (mode) => {
  switch(mode) {
    // case 'prod:modern':
    //   process.env.BROWSERSLIST_ENV = 'modern'
    //   return merge(commonConfig({ outputPath: '/dist-modern' }), productionConfig)
    // case 'prod:legacy':
    //   process.env.BROWSERSLIST_ENV = 'legacy'
    //   return merge(commonConfig({ outputPath: '/dist-legacy' }), productionConfig)
    case 'production':
      return merge(commonConfig(), productionConfig, { mode })
    case 'development':
      return merge(commonConfig(), developmentConfig, { mode })
    default:
      throw new Error(`Trying to use an unknown mode, ${mode}`) 
  }
}

module.exports = getConfig(mode)