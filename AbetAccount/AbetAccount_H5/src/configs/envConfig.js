const _ServiceConfig = {
    ApiService: getApiSericeUrl,
    WebService: getWebServiceUrl,
    WebRootPath: getWebRootPath
};

const EnvConfig = {
    getServiceUrl,
    setEnv,
    env: null,
    isProd: false
}

//ctx koa对象，ctx不为空表示是服务器
function setEnv() {
    EnvConfig.env = getWebEnv();
    EnvConfig.isProd = EnvConfig.env === "prd";
}

function getWebEnv() {
    var h = window.location.hostname.toLowerCase();
    return getEnv(h);
}

function getEnv(h) {
    if (h.indexOf("localhost") >= 0) return "local"
    else if (h.indexOf("dev") >= 0) return "dev"
    else if (h.indexOf("stage") >= 0) return "stage"
    else if (h.indexOf("test2") >= 0) return "test2"
    else if (h.indexOf("test") >= 0) return "test"
    else if (h.indexOf("uat") >= 0) return "uat"
    else return "prd";
}

function getApiSericeUrl() {
    return EnvConfig.isProd ? '/abet/api/' : "/api/";
}

function getWebServiceUrl() {
    return "/abet/h5/";
}

function getWebRootPath() {
    return EnvConfig.isProd ? '/abet/h5' : "";
}

function getServiceUrl(serverName) {
    return () => {
        return _ServiceConfig[serverName]();
    }
}

EnvConfig.setEnv();

export default EnvConfig;