const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const pageConfig = require('./webpack.page.js');

const cacheGroups = {};

pageConfig.commonJsConfigs.forEach((c, i) => {
    if (!c.priority) c.priority = (i + 1) * -10;
    c.jsName = c.jsName || c.name;
    cacheGroups[c.jsName] = {
        test: c.test ? c.test : new RegExp(c.jsName),
        chunks: "initial",
        name: c.name,
        priority: c.priority,
        enforce: true
    }
});

module.exports = merge(common(false), {
    output: {
        filename: '[name].bundle.[chunkhash:8].js',
        path: path.resolve(__dirname, 'dist'),
        chunkFilename: '[name].[chunkhash:8].js',
        publicPath: ''
    },
    mode: "production",
    plugins: [
        new CleanWebpackPlugin(),
        new UglifyJSPlugin(),
        new OptimizeCssAssetsPlugin()
    ],
    optimization: {
        //包清单
        runtimeChunk: {
            name: "manifest"
        },
        //拆分公共包
        splitChunks: {
            cacheGroups: cacheGroups
        }
    }
});