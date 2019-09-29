const ServiceConfig = {
    ApiService: GetApiSericeUrl,
    LoanApplyPlatformApiService: GetLoanApplyPlatformApiServiceUrl,
    EmployeeApiService: GetEmployeeApiServiceUrl
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
    if (h.indexOf("localhost") >= 0 || h.indexOf("risk.xxd.com") >= 0) return "local"
    else if (h.indexOf("dev") >= 0) return "dev"
    else if (h.indexOf("stage") >= 0) return "stage"
    else if (h.indexOf("test2") >= 0) return "test2"
    else if (h.indexOf("test") >= 0) return "test"
    else if (h.indexOf("uat") >= 0) return "uat"
    else return "prd";
}

function GetApiSericeUrl() {
    return AddGatewayHost() + "services/riskctrlapproval/RiskControlApproval/";
}

function GetLoanApplyPlatformApiServiceUrl() {
    return "/LoanApplyPlatform/";
}

function GetEmployeeApiServiceUrl() {
    return AddGatewayHost();
}

function AddGatewayHost() {
    const { Env } = EnvConfig;
    let host = "//www.xinxindai.com/";
    if (Env === "local") host = "http://stage-g.xxd.com/";
    else if (Env === "dev") host = "http://dev-g.xxd.com/";
    else if (Env === "stage") host = "http://stage-g.xxd.com/";
    else if (Env === "test") host = "http://test-g.xxd.com/";
    else if (Env === "test2") host = "http://test2-g.xxd.com/";
    else if (Env === "uat") host = "http://uat-g.xxd.com/";

    return host;
}

function GetServiceUrl(serverName) {
    return () => {
        return ServiceConfig[serverName]();
    }
}

export default EnvConfig;