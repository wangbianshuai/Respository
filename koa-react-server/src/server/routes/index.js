import config from '../configs/RouteConfig';
import Router from 'koa-router';
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server';
import request from "request";
import ejs from 'ejs';
import LogUtil from "../utils/LogUtil";
import DvaIndex from "../../common/dva/Index";

export default class IndexRouter {
    constructor(isProd) {
        this.IsProd = isProd;
        this.router = new Router();
    }

    Init() {
        try {
            this.GetRouterList();
            this.RouterList.forEach(r => this.router.get(r.key, this.InitRouter(r.path, r.component)));

            return this.router.routes();
        }
        catch (error) {
            LogUtil.Error("视始化路由异常", { error })
        }
    }

    GetRouterList() {
        this.RouterList = [];
        for (let key in config) {
            this.RouterList.push({ key, path: `${config[key]}.html`, component: require(`../../common/pages/${config[key]}.js`) })
        }
    }

    InitRouter(path, component) {
        return async (ctx) => {
            try {
                const dva = new DvaIndex(component, {}, { ctx });
                const root = renderToStaticMarkup(React.createElement(dva.Init(path)));
                const initialState = JSON.stringify(dva.GetState());

                if (this.IsProd) await ctx.render(path, { root, initialState });
                else await this.GetHtml(path).then(res => ctx.body = ejs.render(res, { root, initialState }), res => ctx.body = res);
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