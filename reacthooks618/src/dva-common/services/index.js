import { Common } from 'UtilsCommon';
import * as request from '../utils/request';

export default (serviceName, getServiceUrl) => (action) => async (payload) => {
  try {
    let url = action.url;
    payload = payload || {};

    if (url && payload.pathQuery) url += payload.pathQuery;

    if (action.isUrlParams) url = payload.url
    else if (Common.isNullOrEmpty(url) && !Common.isNullOrEmpty(payload.url)) url = payload.url;

    //isToken:The request must have a Token, HasToken: the request has a Token plus。
    let header = {};
    if (action.isToken && !payload.token) return Promise.resolve({ isSuccess: false, isReLogin: true, message: 'the token is null' });
    if ((action.isToken || action.hasToken) && payload.token) header = { token: payload.token };

    if (payload.userAgent) { header = header || {}; header["User-Agent"] = payload.userAgent; }

    let data = {};
    if (payload.url !== undefined || payload.token !== undefined || payload.action !== undefined) {
      for (let key in payload) {
        if (key !== "url" && key !== "pathQuery" && key !== "token" && key !== "action") {
          data[key] = payload[key];
        }
      }
    }
    else data = payload;

    if (url.indexOf("http") !== 0 && getServiceUrl) url = getServiceUrl() + url;

    //Multiple requests merge into one
    if (payload.requestList) {
      return Promise.all(payload.requestList.map(m => {
        var url2 = m.url;
        if (url2.indexOf("http") !== 0 && getServiceUrl) url2 = getServiceUrl() + url2;
        return requestData(m.action || action, url2, m.data, m.dataKey || action.dataKey, m.serviceName || serviceName, m.header || header);
      }));
    }
    else return requestData(action, url, data, action.dataKey, serviceName, header);
  }
  catch (error) {
    const res = { isSuccess: false, message: error.message || error };
    return Promise.resolve(res);
  }
}

function requestData(action, url, data, dataKey, serviceName, header) {
  if (action.method === "GET") return request.get(url, dataKey, serviceName, header);
  else if (action.method === "PUT") return request.put(url, data, dataKey, serviceName, header);
  else if (action.method === "DELETE") return request.delete2(url, data, dataKey, serviceName, header);
  else if (action.isFormData) return request.postFormData(url, data.formData, dataKey, serviceName, header);
  else return request.post(url, data, dataKey, serviceName, header);
}
