import config from './config';
import Router from 'koa-router';
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server';
import request from "request";
import ejs from 'ejs';

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
            const root = renderToStaticMarkup(React.createElement(component, { ctx }));
            await this.GetHtml(path).then(res => ctx.body = ejs.render(res, { root }), res => ctx.body = res);
        }
    }

    GetHtml(url) {
        url = `http://localhost:8090/views/${url}`;

        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    resolve(body)
                }
                else reject("获取html失败");
            });
        });
    }
}


