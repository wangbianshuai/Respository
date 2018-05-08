//数据访问类

//静态类，类名为DataAccess
function DataAccess() { }

//数据请求，参数，request:请求对象，successCallback:成功回调方法，errorCallback:错识回调方法
DataAccess.Request = function (request, successCallback, errorCallback) {
    try {
        if (request == undefined) {
            return;
        }
        if (successCallback == undefined) {
            successCallback = function () {
                //扩展回调方法
                if (request.ExpandCallBack != undefined) {
                    request.ExpandCallBack();
                }
                alert2("操作成功！");
            }
        }
        if (errorCallback == undefined) {
            errorCallback = function (jqXHR, textStatus, errorThrown) {
                if (parseInt(jqXHR.status) == 12031) {
                    window.location.href = window.location.href;
                    return;
                }
                alert2(jqXHR.status + ":" + jqXHR.statusText + "\n" + errorThrown);
                //扩展回调方法
                if (request.ExpandCallback != undefined) {
                    request.ExpandCallback();
                }
            }
        }
        if (request.Data != undefined) {
            request.Data = request.Data.replace(/&lt;/g, "<");
            request.Data = request.Data.replace(/&gt;/g, ">");
            request.Data = request.Data.replace(/\?/g, "&#63;");
        }
        var jqXHR = $.ajax({
            url: GetUrl(request.Url),
            type: request.Type == undefined ? "GET" : request.Type,
            headers: request.Headers == undefined ? {} : request.Headers,
            dataType: request.DataType == undefined ? "json" : request.DataType,
            contentType: request.ContentType == undefined ? "application/x-www-form-urlencoded" : request.ContentType,
            data: request.Data == undefined ? "" : request.Data,
            async: request.Async == undefined ? true : request.Async,
            crossDomain: request.CrossDomain == undefined ? false : request.CrossDomain,
            success: ReqeustSuccessCallback,
            error: errorCallback
        });

        return jqXHR;
    }
    catch (ex) {
        alert2(ex.message);
    }

    function ReqeustSuccessCallback(data, textStatus, jqXHR) {
        if (data != null && !String.IsNullOrEmpty(data.Exception)) {
            alert2(data.Exception);
            //扩展回调方法
            if (request.ExpandCallback != undefined) {
                request.ExpandCallback();
            }
            return;
        }
        if (data != null && !String.IsNullOrEmpty(data.Message)) {
            alert2(data.Message);
            //扩展回调方法
            if (request.ExpandCallback != undefined) {
                request.ExpandCallback();
            }
            return;
        }
        if (data != null && data.NoLogin) {
            DataAccess.ClearCookie();
            window.location.href = window.location.href;
            return;
        }
        if (data != null && data.NoData) {
            if (String.IsNullOrEmpty(request.Data)) {
                alert2("对不起，请求异常，请刷新数据！");
                return;
            }
            DataAccess.Request(request, successCallback, errorCallback);
            return;
        }
        data = DataAccess.Convert_gt_lt(data);
        successCallback(data, textStatus, jqXHR);
    }

    function GetUrl(url) {
        if (url.indexOf("?") > 0) {
            url += "&random=" + Math.random();
        }
        else {
            url += "?random=" + Math.random();
        }
        var loginUserId = Common.GetStorage("LoginUserId");
        if (!String.IsNullOrEmpty(loginUserId)) {
            url += "&LoginUserId=" + loginUserId;
        }
        var token = Common.GetStorage("Token");
        if (!String.IsNullOrEmpty(loginUserId)) {
            url += "&Token=" + token;
        }
        return encodeURI(url);
    }
};

DataAccess.Convert_gt_lt = function (data) {
    if (data != null) {
        data = Parse_gt_lt(data);
    }
    return data;

    function Parse_gt_lt(d) {
        for (var key in d) {
            if (d[key] != null) {
                if ($.isArray(d[key])) {
                    var itemList = [];
                    $.each(d[key], function (index, item) {
                        itemList.push(Parse_gt_lt(item));
                    });
                    d[key] = itemList;
                }
                else if (Object.IsObject(d[key])) {
                    d[key] = Parse_gt_lt(d[key]);
                }
                else if (typeof (d[key]) == "string") {
                    d[key] = d[key].replace(/</g, "&lt;");
                    d[key] = d[key].replace(/>/g, "&gt;");
                }
            }
        }
        return d;
    }
};

DataAccess.GetActionUrl = function (url) {
    return "api/" + url;
};

//GET请求
DataAccess.GetRequest = function (url, successCallback, errorCallback, async, expandCallback) {
    url += url.indexOf('?') > 0 ? "&$get=true" : "?$get=true";
    var request = {};
    request.Url = DataAccess.GetActionUrl(url);
    request.Type = "POST";
    request.Async = async;
    request.ExpandCallback = expandCallback;
    return DataAccess.Request(request, successCallback, errorCallback);
};

//POST请求
DataAccess.PostRequest = function (url, data, successCallback, errorCallback, async, expandCallback) {
    var request = {};
    request.Url = DataAccess.GetActionUrl(url);
    request.Type = "POST";
    request.Async = async;
    request.ExpandCallback = expandCallback;
    request.ContentType = "application/json; charset=utf-8";
    request.Data = JSON.stringify(data);
    return DataAccess.Request(request, successCallback, errorCallback);
};

//PUT请求
DataAccess.PutRequest = function (url, data, successCallback, errorCallback, async, expandCallback) {
    url += url.indexOf('?') > 0 ? "&$put=true" : "?$put=true";
    var request = {};
    request.Url = DataAccess.GetActionUrl(url);
    request.Type = "POST";
    request.Async = async;
    request.ExpandCallback = expandCallback;
    request.ContentType = "application/json; charset=utf-8";
    request.Data = JSON.stringify(data);
    return DataAccess.Request(request, successCallback, errorCallback);
};

//DELETE请求
DataAccess.DeleteRequest = function (url, successCallback, errorCallback, async, expandCallback) {
    url += url.indexOf('?') > 0 ? "&$delete=true" : "?$delete=true";
    var request = {};
    request.Url = DataAccess.GetActionUrl(url);
    request.Type = "GET";
    request.Async = async;
    request.ExpandCallback = expandCallback;
    return DataAccess.Request(request, successCallback, errorCallback);
};

//DELETE请求
DataAccess.DeleteRequestByData = function (url, data, successCallback, errorCallback, async, expandCallback) {
    url += url.indexOf('?') > 0 ? "&$delete=true" : "?$delete=true";
    url += url.indexOf('?') > 0 ? "&$data=true" : "?$data=true";
    var request = {};
    request.Url = DataAccess.GetActionUrl(url);
    request.Type = "POST";
    request.Async = async;
    request.ExpandCallback = expandCallback;
    request.ContentType = "application/json; charset=utf-8";
    request.Data = JSON.stringify(data);
    return DataAccess.Request(request, successCallback, errorCallback);
};