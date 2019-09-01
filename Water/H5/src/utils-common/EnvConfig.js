const ServiceConfig = {
    ApiH5Service: GetApiH5ServiceUrl,
    UserCenterApiService: GetUserCenterApiServiceUrl,
    FileCenterApiService: GetFileCenterApiServiceUrl,
    EloanApiService: GetEloanApiServiceUrl,
	AuthService: GetAuthServiceUrl,
	RiskControlApprovalService:GetRiskControlApprovalServiceUrl,
	ApiService: GetApiSericeUrl,
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

function AddHost() {
	const { Env } = EnvConfig;
	let host = "//www.xinxindai.com/";
	if (Env === "local") host = "http://stage-g.xxd.com/";
	else if (Env === "dev") host = "http://dev.xxd.com/";
	else if (Env === "stage") host = "http://stage-g.xxd.com/";
	else if (Env === "test") host = "http://test.xxd.com/";
	else if (Env === "test2") host = "http://test2.xxd.com/";
	else if (Env === "uat") host = "http://uat.xxd.com/";
	
	return host;
}

// function RiskControlAddHost() {
// 	const { Env } = EnvConfig;
// 	let host = "//www.xinxindai.com/";
// 	if (Env === "local") host = "http://stage.xxd.com/";
// 	else if (Env === "dev") host = "http://dev.xxd.com/";
// 	else if (Env === "stage") host = "http://stage.xxd.com/";
// 	else if (Env === "test") host = "http://test.xxd.com/";
// 	else if (Env === "test2") host = "http://test2.xxd.com/";
// 	else if (Env === "uat") host = "http://uat.xxd.com/";
//
// 	return host;
// }

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

function GetAuthServiceUrl() {
	return AddHost()+"auth/";
}

function GetRiskControlApprovalServiceUrl(){
	return "/RiskControlApproval/";
}

function GetApiSericeUrl() {
	return AddHost() + "services/riskctrlapproval/RiskControlApproval/";
	// return "/RiskControlApproval/";
}


function GetServiceUrl(serverName) {
    return () => {
        return ServiceConfig[serverName]();
    }
}

export default EnvConfig;