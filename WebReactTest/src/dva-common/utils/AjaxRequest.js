import $ from "jquery";

export default class Index {

    static AjaxRequest(request) {
        try {
            var jqXHR = $.ajax({
                url: request.Url,
                type: request.Type === undefined ? "GET" : request.Type,
                headers: request.Headers === undefined ? {} : request.Headers,
                dataType: request.DataType === undefined ? "json" : request.DataType,
                contentType: request.ContentType === undefined ? "application/x-www-form-urlencoded" : request.ContentType,
                data: request.Data === undefined ? "" : request.Data,
                async: request.Async === undefined ? true : request.Async,
                crossDomain: request.CrossDomain === undefined ? false : request.CrossDomain,
                success: request.Callback,
                error: function (jqXHR) {
                    const message = jqXHR.status + ":" + jqXHR.statusText
                    request.Callback({ IsSuccess: false, Message: message, jqXHR })
                }
            });

            return jqXHR;
        }
        catch (ex) {
            console.warn("dva-common/utils/AjaxRequest", ex);
            request.Callback({ IsSuccess: false, Message: ex.message })
        }
    }

    static GetRequest(url, headers, callback, async) {
        return Index.Request(url, "GET", headers, null, callback, async);
    }

    static PostRequest(url, headers, data, callback, async) {
        return Index.Request(url, "POST", headers, data, callback, async);
    }

    static PutRequest(url, headers, data, callback, async) {
        return Index.Request(url, "Put", headers, data, callback, async);
    }

    static FetchRequest(url, data, callback, async) {
        var request = {};
        request.Url = url;
        request.Type = data.method;
        request.Async = async;
        request.Headers = data.headers;
        request.Callback = callback;
        if (data.body) {
            if (data.headers["Content-Type"]) request.ContentType = data.headers["Content-Type"];
            request.Data = data.body;
        }
        return Index.AjaxRequest(request);
    }

    static Request(url, method, headers, data, callback, async) {
        var request = {};
        request.Url = url;
        request.Type = method;
        request.Async = async;
        request.Headers = headers;
        request.Callback = callback;
        if (data) {
            request.ContentType = "application/json; charset=utf-8";
            request.Data = JSON.stringify(data);
        }
        return Index.AjaxRequest(request);
    }

}