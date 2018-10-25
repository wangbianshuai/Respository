var g = (name, template, jsPath, filename, chunks) => { chunks = chunks || ["manifest", name]; return { name, template, jsPath, filename, chunks } };
const PageConfigs = [], CopyConfigs = [];

//*配置
//html页配置
const HtmlPageConfigs = {
    "home/index": { chunks: ["js/jquery"] },
    "common/404": { chunks: ["js/jquery"] }
};

//复制路径列表
const CopyPathList = [
];

//通用js配置,priority:优先级，值大优先打包，第三方需优先项目中通用js打包
const CommonJsConfigs = [
    { name: "js/jquery", jsName: "jquery", priority: 100 }
];

//*配置

CopyPathList.forEach(c => CopyConfigs.push({ from: `./src/${c}`, to: c }));

for (var p in HtmlPageConfigs) {
    const template = `./src/views/${p}.html`;
    const jsPath = `./src/client/${p}.js`;
    const filename = `views/${p}.html`;
    var chunks = HtmlPageConfigs[p].chunks || [];
    chunks = chunks.concat(["manifest", p]);

    PageConfigs.push({ name: p, template, jsPath, filename, chunks });
}

module.exports = { PageConfigs, CopyConfigs, CommonJsConfigs };