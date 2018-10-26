const r = (entryPath, routePath, chunks) => { return { entryPath, routePath, chunks } }

//路由配置
//routePath:koa访问路由路径，多个用字符串数
//entryPath:打包入口路径（controller js）、koa视图路径、react组件路径（react-components js）三者相对路径一致。
//chunks：打包通用js集合

const chunks1 = ["react", "react-dom", "dav", "dva-common", "utils-common"];
const chunks2 = ["jquery"]

const RouterConfigs = [
    r("home/index", ["/", "index"], chunks1),
    r("common/404", "404.html", chunks1)
];

const KoaRoutes = {}, WebpackPageConfigs = [];

RouterConfigs.forEach(c => {
    if (c.routePath.forEach) c.routePath.forEach(p => KoaRoutes[p] = c.entryPath);
    else KoaRoutes[c] = c.entryPath;

    const template = `./src/views/index.html`;
    const jsPath = `./src/controllers/${c.entryPath}.js`;
    const filename = `${c.entryPath}.html`;
    let chunks = c.chunks || [];
    chunks = chunks.map(a => `js/${a}`);
    chunks = chunks.concat(["manifest", c.entryPath]);

    WebpackPageConfigs.push({ name: c.entryPath, template, jsPath, filename, chunks });
});

module.exports = { KoaRoutes, WebpackPageConfigs };



