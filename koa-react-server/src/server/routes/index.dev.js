import config from './config';
import Router from 'koa-router';
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server';
import request from "request";
import ejs from 'ejs';

const router = new Router();

for (let key in config) router.get(key, async (ctx) => {
    const root = renderToStaticMarkup(React.createElement(require(`../controllers/${config[key]}.js`), { ctx }));
    await GetHtml(config[key]).then(res => ctx.body = ejs.render(res, { root }), res => ctx.body = res);
});

function GetHtml(url) {
    url = `http://localhost:8090/views/${url}.html`;

    return new Promise((resolve, reject) => {
        request(url, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                resolve(body)
            }
            else reject("获取html失败");
        });
    });
}

export default router

