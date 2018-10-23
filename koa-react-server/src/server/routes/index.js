import Router from "koa-router";
import React from "react";
import config from "./config";
import { renderToStaticMarkup } from 'react-dom/server'

const router = new Router();

for (let key in config) router.get(key, async (ctx) => {
    const html = renderToStaticMarkup(React.createElement(require(`../controllers/${config[key]}`), { ctx }));
    ctx.body = `<!DOCTYPE html>${html}`;
});

export default router;