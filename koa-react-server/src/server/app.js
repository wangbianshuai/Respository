import koa from "koa";

const app = new koa();

app.use(async function(ctx) {
    ctx.body="hello world";
})

export default app;