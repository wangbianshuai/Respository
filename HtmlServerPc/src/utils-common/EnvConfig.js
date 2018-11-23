const ServiceConfig = {
    ApiService: GetApiSericeUrl,
    BizApiService: GetBizApiServiceUrl,
    BizApiService2: GetBizApiServiceUrl2,
    TradeCenterApiService: GetTradeCenterApiServiceUrl,
    UserCenterApiService: GetUserCenterApiServiceUrl,
    InvestmentApiService: GetInvestmentApiServiceUrl
};

const EnvConfig = {
    GetServiceUrl,
    SetEnv,
    Env: null,
    LogUtil: null,
    IsServer: false,
    GetProxyServiceUrl,
    GetClientBuildUrl
}

var ClientBuildUrl = null;
function GetClientBuildUrl() {
    if (ClientBuildUrl === null) {
        let url = "http://localhost:8090/";
        const { Env } = EnvConfig;
        if (Env === "local") url = "http://localhost:8090/";
        else if (Env === "stage") url = "http://localhost:8080/";
        else if (Env === "test") url = "http://localhost:8080/";
        ClientBuildUrl = url;
    }
    return ClientBuildUrl;
}

function GetProxyServiceUrl(blGet, url, serviceName) {
    return GetApiSericeUrl() + (blGet ? "Proxy/GetRequest" : "Proxy/PostRequest") + "?RequestUrl=" + escape(url) + "&ServiceName=" + escape(serviceName);
}

//ctx koa对象，ctx不为空表示是服务器
function SetEnv(ctx, logUtil) {
    if (logUtil) EnvConfig.LogUtil = logUtil;
    if (ctx) EnvConfig.Env = GetServerEnv(ctx);
    else EnvConfig.Env = GetWebEnv();
}

function GetServerEnv(ctx) {
    EnvConfig.IsServer = true;
    var h = ctx.request.hostname.toLowerCase();
    return GetEnv(h);
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

var ApiSericeUrl = null;
function GetApiSericeUrl() {
    if (ApiSericeUrl === null) {
        let url = "http://localhost:8080/api/";
        const { Env } = EnvConfig;
        if (Env === "local") url = "http://localhost:8080/api/";
        else if (Env === "stage") url = "http://localhost:8080/api/";
        else if (Env === "test") url = "http://localhost:8080/api/";
        ApiSericeUrl = url;
    }
    return ApiSericeUrl;
}

var BizApiServiceUrl = null;
function GetBizApiServiceUrl() {
    if (BizApiServiceUrl === null) {
        let url = "http://api.xinxindai.com/biz/";
        const { Env } = EnvConfig;
        if (Env === "local") url = "http://test-api.xxd.com/biz/";
        else if (Env === "dev") url = "http://api.xxd.com/biz/";
        else if (Env === "stage") url = "http://stage-api.xxd.com/biz/";
        else if (Env === "test") url = "http://test-api.xxd.com/biz/";
        else if (Env === "test2") url = "http://test2-api.xxd.com/biz/";
        else if (Env === "uat") url = "http://uat-api.xxd.com/biz/";

        url = "http://api.xinxindai.com/biz/";
        BizApiServiceUrl = url;
    }
    return BizApiServiceUrl;
}

var BizApiServiceUrl2 = null;
function GetBizApiServiceUrl2() {
    if (BizApiServiceUrl2 === null) {
        let url = "http://www.xinxindai.com/biz/";
        const { Env } = EnvConfig;
        if (Env === "local") url = "http://test.xxd.com/biz/";
        else if (Env === "dev") url = "http://dev.xxd.com/biz/";
        else if (Env === "stage") url = "http://stage.xxd.com/biz/";
        else if (Env === "test") url = "http://test.xxd.com/biz/";
        else if (Env === "test2") url = "http://test2.xxd.com/biz/";
        else if (Env === "uat") url = "http://uat.xxd.com/biz/";

        url = "http://www.xinxindai.com/biz/";
        BizApiServiceUrl2 = url;
    }
    return BizApiServiceUrl2;
}

var TradeCenterApiServiceUrl = null;
function GetTradeCenterApiServiceUrl() {
    if (TradeCenterApiServiceUrl === null) {
        let url = "http://www.xinxindai.com/tradeCenter/";
        const { Env } = EnvConfig;
        if (Env === "local") url = "http://test.xxd.com/tradeCenter/";
        else if (Env === "dev") url = "http://dev.xxd.com/tradeCenter/";
        else if (Env === "stage") url = "http://stage.xxd.com/tradeCenter/";
        else if (Env === "test") url = "http://test.xxd.com/tradeCenter/";
        else if (Env === "test2") url = "http://test2.xxd.com/tradeCenter/";
        else if (Env === "uat") url = "http://uat.xxd.com/tradeCenter/";

        url = "http://www.xinxindai.com/tradeCenter/";
        TradeCenterApiServiceUrl = url;
    }
    return TradeCenterApiServiceUrl;
}

var UserCenterApiServiceUrl = null;
function GetUserCenterApiServiceUrl() {
    if (UserCenterApiServiceUrl === null) {
        let url = "http://www.xinxindai.com/userCenter/";
        const { Env } = EnvConfig;
        if (Env === "local") url = "http://test.xxd.com/userCenter/";
        else if (Env === "dev") url = "http://dev.xxd.com/userCenter/";
        else if (Env === "stage") url = "http://stage.xxd.com/userCenter/";
        else if (Env === "test") url = "http://test.xxd.com/userCenter/"
        else if (Env === "test2") url = "http://test2.xxd.com/userCenter/"
        else if (Env === "uat") url = "http://uat.xxd.com/userCenter/"

        url = "http://www.xinxindai.com/userCenter/";
        UserCenterApiServiceUrl = url;
    }
    return UserCenterApiServiceUrl;
}

var InvestmentApiServiceUrl = null;
function GetInvestmentApiServiceUrl() {
    if (InvestmentApiServiceUrl === null) {
        const { Env } = EnvConfig;
        let url = "http://www.xinxindai.com/investmentAPI/";
        if (Env === "local") url = "http://test.xxd.com/investmentAPI/";
        else if (Env === "dev") url = "http://dev.xxd.com/investmentAPI/";
        else if (Env === "stage") url = "http://stage.xxd.com/investmentAPI/";
        else if (Env === "test") url = "http://test.xxd.com/investmentAPI/";
        else if (Env === "test2") url = "http://test2.xxd.com/investmentAPI/";
        else if (Env === "uat") url = "http://uat.xxd.com/investmentAPI/";

        url = "http://www.xinxindai.com/investmentAPI/";

        InvestmentApiServiceUrl = url;
    }
    return InvestmentApiServiceUrl;
}

function GetServiceUrl(serverName) {
    return () => ServiceConfig[serverName]();
}

export default EnvConfig;