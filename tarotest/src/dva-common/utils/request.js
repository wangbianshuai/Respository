import Taro from '@tarojs/taro';
import { Common, HttpResponse } from 'UtilsCommon';

export function get(url, resKey, serviceName, header) {
  return request(url, null, resKey, serviceName, header);
}

export function post(url, data, resKey, serviceName, header) {
  return requestByMethod(url, data, resKey, serviceName, header, "POST")
}

export function put(url, data, resKey, serviceName, header) {
  return requestByMethod(url, data, resKey, serviceName, header, "PUT");
}

export function delete2(url, data, resKey, serviceName, header) {
  return requestByMethod(url, data, resKey, serviceName, header, "DELETE");
}

export function postFormData(url, data, resKey, serviceName, header) {
  return request(url, {
    method: "POST",
    header: {},
    body: data,
  }, resKey, serviceName, header);
}

export function requestByMethod(url, data, resKey, serviceName, header, method) {
  return request(url, {
    method: method || "POST",
    header: { "Content-Type": "application/json; charset=utf-8" },
    data: JSON.stringify(data)
  }, resKey, serviceName, header);
}

function request(url, options, resKey, serviceName, header) {
  try {
    options = setServiceHeader(options, serviceName);
    options = setParamsHeader(options, header);
    url = getFullUrl(url);
    options.url = url;
    return Taro.request(options).then(res => setResult(res)).then(d => HttpResponse.getResponse(d, resKey), res => HttpResponse.getErrorResponse(res));
  }
  catch (error) {
    console.warn('dva-common/utils/request/request', error);
    const res = { isSuccess: false, message: error.message || error };
    return HttpResponse.getErrorResponse(res, url, options);
  }
}


function setParamsHeader(options, header) {
  if (header) {
    options = options || {};
    options.header = options.header || {};
    for (let key in header) options.header[key] = header[key];
    return options;
  }

  return options;
}

function setServiceHeader(options, serviceName) {
  if (!serviceName) return options;

  return setApiServiceHeader(options, serviceName);
}

const _ClientConfig = {
};

function setApiServiceHeader(data, serviceName) {
  data = data || { header: {}, method: "GET" };

  let clientId = "miniprogram";

  if (_ClientConfig[serviceName]) clientId = _ClientConfig[serviceName];

  data.header.clientId = clientId;
  data.header.clientTime = new Date().getTime();
  data.header.requestId = Common.createGuid().replace(/-/g, "").toLowerCase();

  return data;
}

function getFullUrl(url) {
  return Common.addUrlRandom(url);
}

function setResult(res) {
  if(res.data) return Promise.resolve(res.data);
  return res.ok ? res.json() : Promise.reject(res.status + ":" + (Common.isNullOrEmptyReturnDefault(res.statusText, "Request error!")));
}
