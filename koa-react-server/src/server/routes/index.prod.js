import config from './config';
import Router from 'koa-router';
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server';

const router = new Router();

for (let key in config) router.get(key, async (ctx) => {
    const html = renderToStaticMarkup(React.createElement(require(`../controllers/${config[key]}.js`), { ctx }));
    await ctx.render(`${config[key]}.html`, { root: html });
});

export default router

