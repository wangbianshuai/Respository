const ServiceConfig = {
    ApiH5Service: GetApiH5ServiceUrl,
    UserCenterApiService: GetUserCenterApiServiceUrl,
    FileCenterApiService: GetFileCenterApiServiceUrl,
    EloanApiService: GetEloanApiServiceUrl
};

const EnvConfig = {
    GetServiceUrl,
    SetEnv,
    Env: null,
    IsProd: false
}

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

function GetApiH5ServiceUrl() {
    return "/apih5/api/";
}

function GetUserCenterApiServiceUrl() {
    return "/userCenter/";
}

function GetFileCenterApiServiceUrl() {
    return "/fileCenter/";
}

function GetEloanApiServiceUrl() {
    return "/eloan/";
}

function GetServiceUrl(serverName) {
    return () => {
        return ServiceConfig[serverName]();
    }
}

export default EnvConfig;