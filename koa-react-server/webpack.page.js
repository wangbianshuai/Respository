var g = (name, template, jsPath, filename, chunks) => { chunks = chunks || ["manifest", name]; return { name, template, jsPath, filename, chunks } };
const PageConfigs = [], CopyConfigs = [];

const RouterConfig = require("./src/configs/RouterConfig");
RouterConfig.WebpackPageConfigs.forEach(c => PageConfigs.push(c));

//*配置
//html页配置
const HtmlPageConfigs = {
};

//复制路径列表
const CopyPathList = [
];

//通用js配置
const CommonJsConfigs = [
    { name: "js/jquery", jsName: "jquery", test: /[\\/]node_modules[\\/]jquery[\\/]/ },
    { name: "js/react-dva", jsName: ["react", "react-dom", "dva"],  test: /[\\/]node_modules[\\/](?!jquery)/ },
    { name: "js/util-common", jsName: "UtilsCommon", aliasPath: "./src/utils-common/Index.js", test: /[\\/]src[\\/]utils-common[\\/]/ },
    { name: "js/dva-common", jsName: "DavCommon", aliasPath: "./src/dva-common/Index.js", test: /[\\/]src[\\/]dva-common[\\/]/ }
];

//*配置

CopyPathList.forEach(c => CopyConfigs.push({ from: `./src/${c}`, to: c }));

for (var p in HtmlPageConfigs) {
    const template = `./src/${p}.html`;
    const jsPath = `./src/${p}.js`;
    const filename = `${p}.html`;
    var chunks = HtmlPageConfigs[p].chunks || [];
    chunks = chunks.concat(["manifest", p]);

    PageConfigs.push({ name: p, template, jsPath, filename, chunks });
}

module.exports = { PageConfigs, CopyConfigs, CommonJsConfigs };