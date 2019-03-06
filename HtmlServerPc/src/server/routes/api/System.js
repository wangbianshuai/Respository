import Router from 'koa-router';

const router = new Router({ prefix: '/System' });

router.get('/GetNow', GetNow);

async function GetNow(ctx) {
    ctx.body = { Now: new Date().getTime() }
}

export default router;