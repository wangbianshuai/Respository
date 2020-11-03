var g = (name, template, jsPath, filename, chunks) => { chunks = chunks || []; chunks = chunks.concat(["manifest", name]); return { name, template, jsPath, filename, chunks } };
const pageConfigs = [];

const chunks1 = ["vendors", 'framework'];

//*配置
//html页配置
const htmlPageConfigs = {
    "index": { chunks: chunks1 },
};

//通用js配置,priority:优先级，值大优先打包，第三方需优先项目中通用js打包
const commonJsConfigs = [
    { name: "vendors", test: /[\\/]node_modules[\\/]/ },
    {
        name: "framework",
        test: /[\\/]src[\\/](utils-common|dva-common|use-hooks|components|controls|data-actions|data-items|event-actions|page-components|page-controls|page-templates|configs)[\\/]/
    }
];

//别名
const alias = {
    UtilsCommon: './src/utils-common/index.js',
    DvaCommon: './src/dva-common/index.js',
    UseHooks: './src/use-hooks/index.js',
    Components: './src/components/index.js',
    Controls: './src/controls/index.js',
    DataActions: './src/data-actions/index.js',
    EventActions: './src/event-actions/index.js',
    PageControls: './src/page-controls/index.js',
    PageTemplates: './src/page-templates/index.js',
    Configs: './src/configs/index.js',
    DataItems: './src/data-items/index.js'
}

for (var p in htmlPageConfigs) {
    const template = `./src/${p}.ejs`;
    const jsPath = `./src/${p}.js`;
    const filename = `${p}.html`;
    var chunks = htmlPageConfigs[p].chunks || [];
    chunks = chunks.concat([p, "manifest"]);

    pageConfigs.push({ name: p, template, jsPath, filename, chunks });
}

module.exports = { pageConfigs, alias, commonJsConfigs };