'use strict'
require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.update.conf')
const update = require('../buildUpdate')

const spinner = ora('building for production...')
spinner.start()

rm(path.join(config.update.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, (err, stats) => {
    spinner.stop()
    if (err) throw err

    if (stats.hasErrors()) {
      console.log(chalk.red('  Build failed with errors.\n'))
      process.exit(1)
    }

    update().then(res => {
      console.log(chalk.cyan(`  Update chunk ${res.success ? 'complete' : 'error'}:`))
      console.log(chalk.cyan(`  ${res.chunk.join(',')}\n`))
    }).catch(e => {
      throw e
    })
  })
})
