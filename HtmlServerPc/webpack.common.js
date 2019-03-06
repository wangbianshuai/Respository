const HtmlWebpackPlugin = require('html-webpack-plugin');
const pageConfig = require("./webpack.page.js");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const entry = {}, alias = {};

const pluginsList = [new MiniCssExtractPlugin({
    filename: "[name].[chunkhash:8].css",
    chunkFilename: "[name].[chunkhash:8].css"
})];

function GetHtmlWebpackPlugin(pageConfig) {
    return new HtmlWebpackPlugin({
        filename: pageConfig.filename,
        template: pageConfig.template,
        minify: {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
        },
        chunks: pageConfig.chunks,
        hash: false,
        chunksSortMode: 'none'
    });
}

pageConfig.PageConfigs.forEach(p => { entry[p.name] = p.jsPath; pluginsList.push(GetHtmlWebpackPlugin(p)); });

pageConfig.CommonJsConfigs.forEach(c => {
    if (!entry[c.name]) entry[c.name] = c.jsName;
    if (!alias[c.aliasPath] && c.aliasPath) alias[c.jsName] = path.resolve(__dirname, c.aliasPath);
});

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
                    plugins: ['@babel/transform-runtime']
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
            use: [MiniCssExtractPlugin.loader, 'css-loader', "sass-loader"]
        },
        {
            test: /\.(jpg|png|gif|webp)$/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 1024,
                    name: '[name].[hash:5].[ext]',
                    outputPath: 'images/'
                }
            }]
        }, {
            test: /\.json$/,
            use: 'json-loader'
        }, 
        {
            test: /\.html$/,
            use: 'html-loader'
        }]
    }
};