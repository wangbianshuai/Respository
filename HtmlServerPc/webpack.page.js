var g = (name, template, jsPath, filename, chunks) => { chunks = chunks || ["manifest", name]; return { name, template, jsPath, filename, chunks } };
const PageConfigs = [], CopyConfigs = [];

const RouterConfig = require("./src/configs/RouterConfig");
RouterConfig.WebpackPageConfigs.forEach(c => PageConfigs.push(c));
RouterConfig.CopyConfigs.forEach(c => CopyConfigs.push(c));

//*配置
//html页配置
const HtmlPageConfigs = {
};

//复制路径列表
const CopyPathList = [
];

//通用js配置,priority:优先级，值大优先打包，第三方需优先项目中通用js打包
const CommonJsConfigs = [
    { name: "js/jquery", jsName: "jquery", test: /[\\/]node_modules[\\/]jquery[\\/]/ },
    { name: "js/react-dva", jsName: ["react", "react-dom", "dva"], test: /[\\/]node_modules[\\/](?!jquery)/ },
    { name: "js/util-common", jsName: "UtilsCommon", aliasPath: "./src/utils-common/Index.js", test: /[\\/]src[\\/]utils-common[\\/]/ },
    { name: "js/dva-common", jsName: "DavCommon", aliasPath: "./src/dva-common/Index.js", test: /[\\/]src[\\/]dva-common[\\/]/ },
    { name: "js/react-common", jsName: "ReactCommon", aliasPath: "./src/react-common/Index.js", test: /[\\/]src[\\/]react-common[\\/]/ },
    {
        name: "css/public", jsName: [
            "./src/public/css/variable.less",
            "./src/public/css/reset.less",
            "./src/public/css/header.less",
            "./src/public/css/footer.less",
            "./src/public/css/rotate.less",
            "./src/public/css/tip.less",
            "./src/public/css/dialog.less",
            "./src/public/css/dialog-float.less",
            "./src/public/css/backTop.less",
            "./src/public/css/paging.less"
        ]
    }
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