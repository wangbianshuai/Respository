import Router from 'koa-router';
import user from "../../controllers/api/user";

const router = new Router({prefix: '/user'});

router.post('/getUserInfo', user.getUserInfo);

export default router;