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
    tokenKey: '280C49BF-1CE7-4AC6-A71F-F34419C58C75',
    wxUserKey: 'A38ECD0D-E75A-40E0-89AE-8BDEE6827ABB'
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

function getResourcesServiceUrl() {
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