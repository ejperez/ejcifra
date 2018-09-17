'use strict'

require('./check-versions')()

process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')
const shell = require('shelljs')

const spinner = ora('building for production...')
spinner.start()

shell.rm('-rf', 'docs/*')
console.log(chalk.cyan('  Cleaned docs.\n'))

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
	))

	shell.cp('-rf', 'dist/*', 'docs')
	console.log(chalk.cyan('  Copied content of dist to docs.\n'))
	
	shell.sed('-i', '/static', 'static', 'docs/index.html')
	console.log(chalk.cyan('  Modified index.html.\n'))
  })
})