const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const common = require('./webpack.common.js');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const pageConfig = require("./webpack.page.js");
const _externals = require('externals-dependencies');

const cacheGroups = {};

pageConfig.CommonJsConfigs.forEach(c => {
    cacheGroups[c.jsName] = {
        test: new RegExp(c.jsName),
        chunks: "initial",
        name: c.name,
        priority: c.priority,
        enforce: true
    }
});

module.exports = [merge(common, {
    output: {
        filename: '[name].bundle.[chunkhash:8].js',
        path: path.resolve(__dirname, 'dist/client'),
        chunkFilename: '[name].[chunkhash:8].js',
        publicPath: '/'
    },
    mode: "production",
    plugins: [
        new CleanWebpackPlugin(['dist']),
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
}),
{
    entry: { server: './src/server/server.prod.js' },
    output: {
        path: path.resolve(__dirname, 'dist/server'),
        filename: '[name].js',
        chunkFilename: 'chunk.[name].js'
    },
    resolve: {
        extensions: [".js"]
    },
    target: 'node',
    externals: _externals(),
    context: __dirname,
    node: {
        console: true,
        global: true,
        process: true,
        Buffer: true,
        __filename: true,
        __dirname: true,
        setImmediate: true,
        path: true
    },
    mode: "production",
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-react", "@babel/preset-env"],
                    plugins: ['@babel/transform-runtime', "@babel/plugin-transform-modules-commonjs", "add-module-exports"],
                }
            }
        }]
    },
    resolve: { extensions: [".js"] },
    plugins: [
        new UglifyJSPlugin()
    ]
}];