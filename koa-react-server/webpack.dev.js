const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const pageConfig = require("./webpack.page.js");

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: "development",
    devServer: {
        contentBase: './dist',
        hot: true,
        port: 8090,
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist/client'),
        chunkFilename: '[name].js',
        publicPath: 'http://localhost:8090/'
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new CopyWebpackPlugin(pageConfig.CopyConfigs)
    ]
});