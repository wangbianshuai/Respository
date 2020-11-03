const HtmlWebpackPlugin = require('html-webpack-plugin');
const pageConfig = require('./webpack.page.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const entry = {}, alias = {};

const pluginsList = [new MiniCssExtractPlugin({
    filename: "[name].[chunkhash:8].css",
    chunkFilename: "[name].[chunkhash:8].css"
})];

const chunksSortMode = (chunks) => (chunk1, chunk2) => {
    var order1 = chunks.indexOf(chunk1);
    var order2 = chunks.indexOf(chunk2);
    return order1 - order2;
}

function getHtmlWebpackPlugin(config) {
    return new HtmlWebpackPlugin({
        filename: config.filename,
        template: config.template,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        chunks: config.chunks,
        hash: false,
        chunksSortMode: chunksSortMode(config.chunks)
    });
}

pageConfig.pageConfigs.forEach(p => { entry[p.name] = p.jsPath; pluginsList.push(getHtmlWebpackPlugin(p)); });

for (var key in pageConfig.alias) {
    alias[key] = path.resolve(__dirname, pageConfig.alias[key]);
}

module.exports = {
    entry: entry,
    plugins: pluginsList,
    resolve: {
        extensions: [".js", ".json", ".css", "less", "scss"],
        alias: alias
    },
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ["@babel/preset-react", "@babel/preset-env"],
                    plugins: ['@babel/transform-runtime', '@babel/plugin-proposal-class-properties', '@babel/plugin-transform-object-assign', ["import", { libraryName: "antd-mobile", style: "css" }]]
                }
            }
        },
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
            test: /\.less$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', "less-loader"]
        },
        {
            test: /\.(scss|sass)$/,
            use: [MiniCssExtractPlugin.loader, {
                loader: 'css-loader',
                options: {
                    modules: {
                        mode: 'local',
                        localIdentName: '[local]__[hash:5]'
                    },
                }
            }, "sass-loader"]
        },
        {
            test: /\.(jpg|png|ico|gif|webp)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: '[name].[hash:5].[ext]',
                    esModule: false,
                    outputPath: 'images/'
                }
            }]
        }, {
            test: /\.json$/,
            use: 'json-loader'
        },
        {
            test: /\.ejs/,
            use: {
                loader: 'ejs-loader',
                options: {
                    esModule: false,
                    variable: 'data'
                }
            }
        },
        {
            test: /\.html$/,
            use: 'html-loader'
        }]
    }
};