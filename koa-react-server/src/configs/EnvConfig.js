const ServiceConfig = {
    ApiService: GetApiSericeUrl
};

var Env = null, IsServer = false, LogUtil = null;

//ctx koa对象，ctx不为空表示是服务器
function SetEnv(ctx, logUtil) {
    if (logUtil) LogUtil = logUtil;
    if (ctx) return GetServerEnv(ctx);
    else return GetWebEnv();
}

function GetServerEnv(ctx) {
    IsServer = true;
    var h = ctx.request.hostname.toLowerCase();
    if (h.indexOf("localhost") >= 0) return "local"
    else if (h.indexOf("stage") >= 0) return "stage"
    else if (h.indexOf("test") >= 0) return "test"
    else return "prd";
}

function GetWebEnv() {
    var h = window.location.hostname.toLowerCase();
    if (h.indexOf("localhost") >= 0) return "local"
    else if (h.indexOf("stage") >= 0) return "stage"
    else if (h.indexOf("test") >= 0) return "test"
    else return "prd";
}

var ApiSericeUrl = null;
function GetApiSericeUrl() {
    if (ApiSericeUrl === null) {
        if (Env === "local") return "http://localhost:8080/api/";
        else if (Env === "stage") return "http://localhost:8080/api/";
        else if (Env === "test") return "http://localhost:8080/api/"
        else return "http://localhost:8080/api/";
    }
    return ApiSericeUrl;
}

function GetServiceUrl(serverName) {
    return () => ServiceConfig[serverName]();
}

export {
    GetServiceUrl,
    SetEnv,
    Env,
    LogUtil,
    IsServer
}