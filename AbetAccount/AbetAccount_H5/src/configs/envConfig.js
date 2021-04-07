const _ServiceConfig = {
    ApiService: getApiSericeUrl,
    WebService: getWebServiceUrl,
    WebRootPath: getWebRootPath,
};

const EnvConfig = {
    getServiceUrl,
    setEnv,
    env: null,
    isProd: false,
    tokenKey: '98EE4789-1502-43C4-84E6-7264A1410B16'
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
    if (h.indexOf("localhost") >= 0 || h.indexOf('192.168.1.4') >= 0) return "local"
    else return "prd";
}

function getWebServiceUrl() {
    return EnvConfig.isProd ? "/" : '/';
}

function getWebRootPath(){
    return EnvConfig.isProd ? "/" : '';
}

function getApiSericeUrl() {
    return EnvConfig.isProd ? '//www.lianliyuan.site/api/' : '/api/';
}

function getServiceUrl(serverName) {
    return () => {
        return _ServiceConfig[serverName]();
    }
}

EnvConfig.setEnv();

export default EnvConfig;