var log4js = require('log4js');

var log_config = require('../configs/Log4Config');

//加载配置文件
log4js.configure(log_config);

var logUtil = {};

var errorLogger = log4js.getLogger('errorLogger');
var resLogger = log4js.getLogger('resLogger');
var infoLogger = log4js.getLogger('infoLogger');

logUtil.Error = function (title, obj) {
    const list = [];
    //错误信息开始
    list.push(`\n*************** ${title} error log start ***************`);

    for (let key in obj) list.push(`${key}：${obj[key]}`)

    //错误信息结束
    list.push(`*************** ${title} error log end ***************`);

    const message = list.join("\n");
    console.log(message);
    errorLogger.error(message);
};

logUtil.Info = function (title, obj) {
    const list = [];
    //信息开始
    list.push(`\n*************** ${title} info log start ***************`);

    for (let key in obj) list.push(`${key}：${obj[key]}`)

    //信息结束
    list.push(`*************** ${title} info log end ***************`);

    infoLogger.info(list.join("\n"));
};

//封装错误日志
logUtil.logError = function (ctx, error, resTime) {
    if (ctx && error) {
        const message = formatError(ctx, error, resTime);
        console.log(message);
        errorLogger.error(message);
    }
};

//封装响应日志
logUtil.logResponse = function (ctx, resTime) {
    if (ctx) {
        resLogger.trace(formatRes(ctx, resTime));
    }
};

//格式化响应日志
var formatRes = function (ctx, resTime) {
    var logText = new String();

    //响应日志开始
    logText += "\n" + "*************** trace log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //响应状态码
    logText += "response status: " + ctx.status + "\n";

    //响应内容
    logText += "response body: " + "\n" + JSON.stringify(ctx.body) + "\n";

    //响应日志结束
    logText += "*************** trace log end ***************" + "\n";

    return logText;

}

//格式化错误日志
var formatError = function (ctx, err, resTime) {
    var logText = new String();

    //错误信息开始
    logText += "\n" + "*************** error log start ***************" + "\n";

    //添加请求日志
    logText += formatReqLog(ctx.request, resTime);

    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";

    //错误信息结束
    logText += "*************** error log end ***************" + "\n";

    return logText;
};

//格式化请求日志
var formatReqLog = function (req, resTime) {

    var logText = new String();

    var method = req.method;
    //访问方法
    logText += "request method: " + method + "\n";

    //请求原始地址
    logText += "request originalUrl:  " + req.originalUrl + "\n";

    //客户端ip
    logText += "request client ip:  " + req.ip + "\n";

    //开始时间
    var startTime;
    //请求参数
    if (method === 'GET') {
        logText += "request query:  " + JSON.stringify(req.query) + "\n";
        // startTime = req.query.requestStartTime;
    } else {
        logText += "request body: " + "\n" + JSON.stringify(req.body) + "\n";
        // startTime = req.body.requestStartTime;
    }
    //服务器响应时间
    logText += "response time: " + resTime + "ms\n";

    return logText;
}

module.exports = logUtil;
