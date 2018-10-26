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

//通用js配置,priority:优先级，值大优先打包，第三方需优先项目中通用js打包
const CommonJsConfigs = [
    { name: "js/react-dom", jsName: "react-dom", priority: 230 },
    { name: "js/react", jsName: "react", priority: 220 },
    { name: "js/dva", jsName: "dva", priority: 210 },
    { name: "js/jquery", jsName: "jquery", priority: 100 },
    { name: "js/util-common", jsName: "UtilsCommon", priority: 89, aliasPath: "./src/utils-common/Index.js" },
    { name: "js/dva-common", jsName: "DavCommon", priority: 88, aliasPath: "./src/dva-common/Index.js" }
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

console.log(PageConfigs);

module.exports = { PageConfigs, CopyConfigs, CommonJsConfigs };