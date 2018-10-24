import config from './config';
import Router from 'koa-router';
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server';

export default class IndexRouter {
    constructor() {
        this.router = new Router();
        this.GetRouterList();
    }

    Init() {
        this.RouterList.forEach(r => this.router.get(r.key, this.InitRouter(r.path, r.component)));

        return this.router;
    }

    GetRouterList() {
        this.RouterList = [];
        for (let key in config) {
            this.RouterList.push({ key, path: `${config[key]}.html`, component: require(`../controllers/${config[key]}.js`) })
        }
    }

    InitRouter(path, component) {
        return async (ctx) => {
            const html = renderToStaticMarkup(React.createElement(component, { ctx }));
            await ctx.render(path, { root: html });
        }
    }
}
