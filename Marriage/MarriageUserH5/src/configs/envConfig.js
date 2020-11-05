const _ServiceConfig = {
    ApiService: getApiSericeUrl,
    WebService: getWebServiceUrl,
    ImageService: getImageServiceUrl,
    ResourcesService: getResourcesServiceUrl
};

const EnvConfig = {
    getServiceUrl,
    setEnv,
    env: null,
    isProd: false,
    tokenKey: 'D69BE2A5-591E-4173-A4BC-4420EFA20AF1',
    loginUserIdKey: '377D979D-CBA2-417F-A013-05A1E883FFBB',
    loginUserKey: 'AF695C1B-AA1B-48CF-93D1-A4D0D6C845E9',
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
    return EnvConfig.isProd ? "/user/" : '/';
}

function getResourcesServiceUrl(){
    return EnvConfig.isProd ? "/res/api/" : 'http://localhost/res/api/';
}

function getApiSericeUrl() {
    return "/api/";
}

function getImageServiceUrl() {
    return EnvConfig.isProd ? '/res/' : 'http://localhost/res/';
}

function getServiceUrl(serverName) {
    return () => {
        return _ServiceConfig[serverName]();
    }
}

EnvConfig.setEnv();

export default EnvConfig;