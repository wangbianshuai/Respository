import { KoaRoutes } from "../../configs/RouterConfig";
import Router from 'koa-router';
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server';
import request from "request";
import ejs from 'ejs';
import LogUtil from "../utils/LogUtil";
import DvaIndex from "../../dva-common/Index";

export default class IndexRouter {
    constructor(isProd) {
        this.IsProd = isProd;
        this.router = new Router();
    }

    Init() {
        try {
            this.GetRouterList();
            this.RouterList.forEach(r => this.router.get(r.key, this.InitRouter(r.path, r.component, r.controller)));

            return this.router.routes();
        }
        catch (error) {
            LogUtil.Error("视始化路由异常", { error })
        }
    }

    GetRouterList() {
        this.RouterList = [];
        let v = null;
        for (let key in KoaRoutes) {
            v = KoaRoutes[key];
            this.RouterList.push({ key, path: `${v}.html`, component: require(`../../components/${v}.js`), controller: require(`../controllers/${v}.js`) });
        }
    }

    InitRouter(path, component, controller) {
        return async (ctx) => {
            try {
                //初始化 dva
                const dva = new DvaIndex(component, {}, { ctx });
                const App = dva.Init();

                //初始化 koa controller
                const ctl = new controller(ctx, dva);
                await ctl.LoadData();

                //渲染react组件
                const root = renderToStaticMarkup(React.createElement(App));
                //获取dva state数据
                const initialState = JSON.stringify(dva.GetState());
                //获取实体数据
                const model = ctl.Model || {};

                const data = { root, initialState, ...model };

                if (this.IsProd) await ctx.render(path, data);
                else await this.GetHtml(path).then(res => ctx.body = ejs.render(res, data), res => ctx.body = res);
            }
            catch (error) {
                LogUtil.Error("页面请求异常", { path, error });
                ctx.body = error.toString();
            }
        }
    }

    GetHtml(url) {
        url = `http://localhost:8090/views/${url}`;

        return new Promise((resolve, reject) => {
            request(url, (error, response, body) => {
                if (!error && response.statusCode === 200) resolve(body);
                else if (!error && response) reject(`获取视图页面异常：${response.statusCode}：${response.statusMessage}`)
                else reject(error);
            });
        });
    }
}