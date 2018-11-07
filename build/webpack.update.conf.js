'use strict'
const fs = require('fs')
//const ora = require('ora')
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config/index')
const dllConfig = require('../config/dll')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
//const CopyWebpackPlugin = require('copy-webpack-plugin')
//const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const NyanProgressPlugin = require('nyan-progress-webpack-plugin')
//const cleanWebpackPlugin = require('clean-webpack-plugin')
const AssetsInfoPlugin = require('./plugin/webpack-assets-info-plugin')

const entry = {}
const definePluginArr = []

//let spinner = ora('building for production...\n').start()

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env')

for (let key in dllConfig.entry) {
  entry[key] = dllConfig.entry[key]
  let manifestPath = resolve(`${/\.\.\//.test(dllConfig.output) ? dllConfig.output.slice(2) : dllConfig.output}/${key}_manifest.json`)
  // check module depend on the existence of the corresponding file
  if (!fileExist(manifestPath)) {
    console.log(`! ${key} module not found, please run: npm run dll \n`)
    process.exit(1)
  }
  console.log(`- push module --> ${key}`)
  definePluginArr.push(new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require(`${dllConfig.output}/${key}_manifest.json`)
  }))
}

const webpackConfig = merge(baseWebpackConfig, {
  entry: {
    app: './src/router/update.js'
  },
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.update.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[name].[chunkhash].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    //new cleanWebpackPlugin([config.update.]),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_debugger: true,
          drop_console: true
        }
      },
      sourceMap: config.build.productionSourceMap,
      parallel: true
    }),
    //new NyanProgressPlugin({
    //  logger: function () {
    //  },
    //  getProgressMessage: function (progress, messages, styles) {
    //    spinner.text = 'status:' + (progress * 100).toFixed(2) + '%' + '  ' + messages[0] || messages[1]
    //    if (progress == 1) {
    //      console.log('\nstatus:' + (progress * 100).toFixed(2) + '%', messages[0] || messages[1])
    //      spinner.stop()
    //    }
    //  },
    //  restoreCursorPosition: true
    //}),
    ...definePluginArr,
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      // Setting the following option to `false` will not extract CSS from codesplit chunks.
      // Their CSS will instead be inserted dynamically with style-loader when the codesplit chunk has been loaded by webpack.
      // It's currently set to `true` because we are seeing that sourcemaps are included in the codesplit bundle as well when it's `false`,
      // increasing file size: https://github.com/vuejs-templates/webpack/issues/1110
      allChunks: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: config.build.productionSourceMap
        ? {safe: true, map: {inline: false}}
        : {safe: true}
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    //new HtmlWebpackPlugin({
    //  filename: process.env.NODE_ENV === 'testing'
    //    ? 'index.html'
    //    : config.update.index,
    //  template: 'index.html',
    //  inject: true,
    //  minify: {
    //    removeComments: true,
    //    //collapseWhitespace: true,
    //    removeAttributeQuotes: true
    //    // more options:
    //    // https://github.com/kangax/html-minifier#options-quick-reference
    //  },
    //  // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //  chunksSortMode: 'dependency'
    //}),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin(),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks (module) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    }),
    // This instance extracts shared chunks from code splitted chunks and bundles them
    // in a separate chunk, similar to the vendor chunk
    // see: https://webpack.js.org/plugins/commons-chunk-plugin/#extra-async-commons-chunk
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      async: 'vendor-async',
      children: true,
      minChunks: 3
    }),

    // path info associate with the emitted chunk file.
    new AssetsInfoPlugin(config.build.assets.fileName)
  ]
})

//if (config.build.productionGzip) {
//  const CompressionWebpackPlugin = require('compression-webpack-plugin')
//
//  webpackConfig.plugins.push(
//    new CompressionWebpackPlugin({
//      asset: '[path].gz[query]',
//      algorithm: 'gzip',
//      test: new RegExp(
//        '\\.(' +
//        config.build.productionGzipExtensions.join('|') +
//        ')$'
//      ),
//      threshold: 10240,
//      minRatio: 0.8
//    })
//  )
//}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

function fileExist (filePath) {
  try {
    return fs.statSync(filePath).isFile()
  } catch (err) {
    return false
  }
}

module.exports = webpackConfig
