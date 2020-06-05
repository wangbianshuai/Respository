const ServiceConfig = {
    ApiService: GetApiSericeUrl,
    MessageApiService: GetMessageApiServiceUrl,
};

const EnvConfig = {
    GetServiceUrl,
    SetEnv,
    Env: null,
    IsProd: false
}

//ctx koa对象，ctx不为空表示是服务器
function SetEnv() {
    EnvConfig.Env = GetWebEnv();
    EnvConfig.IsProd = EnvConfig.Env === "prd";
}

function GetWebEnv() {
    var h = window.location.hostname.toLowerCase();
    return GetEnv(h);
}

function GetEnv(h) {
    if (h.indexOf("localhost") >= 0) return "local"
    else if (h.indexOf("dev") >= 0) return "dev"
    else if (h.indexOf("stage") >= 0) return "stage"
    else if (h.indexOf("test2") >= 0) return "test2"
    else if (h.indexOf("test") >= 0) return "test"
    else if (h.indexOf("uat") >= 0) return "uat"
    else return "prd";
}

function GetApiSericeUrl() {
    return "/web/";
}

function GetMessageApiServiceUrl() {
    return "/api/";
}

function GetServiceUrl(serverName) {
    return () => {
        return ServiceConfig[serverName]();
    }
}

export default EnvConfig;