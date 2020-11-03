const _ServiceConfig = {
    ApiService: getApiSericeUrl,
    WebService: getWebServiceUrl,
    ImageService: getImageServiceUrl
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
    if (h.indexOf("localhost") >= 0 || h.indexOf('192.168.1.157') >= 0) return "local"
    else return "prd";
}

function getWebServiceUrl() {
    return EnvConfig.isProd ? "/" : '/';
}

function getApiSericeUrl() {
    return "/api/";
}

function getImageServiceUrl() {
    return EnvConfig.isProd ? 'http://www.lianliyuan.site/' : 'http://localhost/res';
}

function getServiceUrl(serverName) {
    return () => {
        return _ServiceConfig[serverName]();
    }
}

EnvConfig.setEnv();

export default EnvConfig;