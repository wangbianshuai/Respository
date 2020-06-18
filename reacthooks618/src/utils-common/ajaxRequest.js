import $ from "jquery";

export default class Index {

    static ajaxRequest(request) {
        try {
            var jqXHR = $.ajax({
                url: request.Url,
                type: request.type === undefined ? "GET" : request.type,
                headers: request.headers === undefined ? {} : request.headers,
                dataType: request.DataType === undefined ? "json" : request.DataType,
                contentType: request.ContentType === undefined ? "application/x-www-form-urlencoded" : request.ContentType,
                data: request.data === undefined ? "" : request.data,
                async: request.Async === undefined ? true : request.Async,
                crossDomain: request.CrossDomain === undefined ? false : request.CrossDomain,
                success: request.Callback,
                beforeSend: function (xhr) {
                    xhr.withCredentials = true;
                },
                xhrFields: {
                    withCredentials: true
                },
                error: function (jqXHR) {
                    const message = jqXHR.status + ":" + jqXHR.statusText
                    request.Callback({ isSuccess: false, message: message, jqXHR })
                }
            });

            return jqXHR;
        }
        catch (ex) {
            console.warn("utils-common/ajaxRequest", ex);
            request.Callback({ isSuccess: false, message: ex.message })
        }
    }

    static getRequest(url, headers, callback, async) {
        return Index.request(url, "GET", headers, null, callback, async);
    }

    static postRequest(url, headers, data, callback, async) {
        return Index.request(url, "POST", headers, data, callback, async);
    }

    static putRequest(url, headers, data, callback, async) {
        return Index.request(url, "put", headers, data, callback, async);
    }

    static fetchRequest(url, data, callback, async) {
        var request = {};
        request.Url = url;
        request.type = data.method;
        request.Async = async;
        request.headers = data.headers;
        request.Callback = callback;
        if (data.body) {
            if (data.headers["Content-type"]) request.ContentType = data.headers["Content-type"];
            request.data = data.body;
        }
        return Index.ajaxRequest(request);
    }

    static request(url, method, headers, data, callback, async) {
        var request = {};
        request.Url = url;
        request.type = method;
        request.Async = async;
        request.headers = headers;
        request.Callback = callback;
        if (data) {
            request.ContentType = "application/json; charset=utf-8";
            request.data = JSON.stringify(data);
        }
        return Index.ajaxRequest(request);
    }

    static promisePost(url, headers, data) {
        return new Promise((resolve, reject) => {
            try {
                Index.postRequest(url, headers, data, (res) => resolve(res), false);
            }
            catch (error) {
                console.warn("utils-common/ajaxRequest", error);
                resolve({ isSuccess: false, message: error.message || error })
            }
        });
    }
}