const _ServiceConfig = {
    ApiService: getApiSericeUrl,
    WebService: getWebServiceUrl,
    ImageService: getImageServiceUrl,
    A2ApiService: getA2ApiServiceUrl
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
    if (h.indexOf("localhost") >= 0 || h.indexOf('192.168.1.154') >= 0) return "local"
    else return "prd";
}

function getWebServiceUrl() {
    return EnvConfig.isProd ? "/miniSite/" : '/';
}

function getApiSericeUrl() {
    return "/zzl/";
}

function getImageServiceUrl() {
    return EnvConfig.isProd ? 'http://www.wikispectra.com/' : 'http://192.168.1.10:1088/';
}

function getA2ApiServiceUrl(){
    return '//digital.a2china.cn/';
}

function getServiceUrl(serverName) {
    return () => {
        return _ServiceConfig[serverName]();
    }
}

EnvConfig.setEnv();

export default EnvConfig;