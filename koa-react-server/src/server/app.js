import koa from "koa";
import router from "./routes/index";

const app = new koa();

app.use(router.routes())

export default app;