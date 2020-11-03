const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');
const apiMocker = require('mocker-api')

module.exports = merge(common, {
	devtool: 'inline-source-map',
	mode: 'development',
	devServer: {
		before(app) {
			apiMocker(app, path.resolve('./mock/index.js'))
		},
		contentBase: './dist',
		hot: true,
		proxy: {
			'/zzl/': {
				target: 'http://192.168.1.10:1088/',
				changeOrigin: true
			}
		}
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		chunkFilename: '[name].js',
		publicPath: ''
	},
	plugins: [
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin()
	]
})
