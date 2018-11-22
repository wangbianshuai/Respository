import Router from 'koa-router';
import DvaIndex from "DavCommon";

const router = new Router({ prefix: '/Proxy' });

router.get('/GetRequest', GetRequest);
router.post('/PostRequest', PostRequest);

async function Request(ctx, blGet) {
    const headers = { "User-Agent": ctx.headers["user-agent"], token: ctx.headers["token"] };
    const url = ctx.query.RequestUrl;
    const serviceName = ctx.query.ServiceName;
    const data = ctx.request.body;

    const request = DvaIndex.GetRequest();

    if (blGet) ctx.body = await request.Get(url, "", serviceName, headers);
    else ctx.body = await request.Post(url, data, "", serviceName, headers);
}

async function GetRequest(ctx) {
    await Request(ctx, true);
}

async function PostRequest(ctx) {
    await Request(ctx, false);
}

export default router;