import { Common } from 'UtilsCommon';
import * as request from '../utils/request';

export default (serviceName, getServiceUrl) => (action) => async (payload) => {
  try {
    let url = action.url;
    payload = payload || {};

    if (url && payload.pathQuery) url += payload.pathQuery;

    if (!Common.isNullOrEmpty(payload.url)) url = payload.url;

    //isToken:The request must have a token, Hastoken: the request has a token plus。
    let headers = {};
    if (action.isToken && !payload.token) return Promise.resolve({ isSuccess: false, isReLogin: true, message: 'the token is null' });
    if ((action.isToken || action.hasToken || action.isTokenAccess) && payload.token) {
      headers = { token: payload.token };

      if (action.isFormData && payload.formData) {
        if (payload.formData instanceof FormData) {
          payload.formData.set('Valid', JSON.stringify({ UserUID: payload.loginUserId, Token: payload.token }));
          payload.formData.set('Act', payload.formData.get('Act') + '_NV');
        }
        else {
          payload.formData.Valid = JSON.stringify({ UserUID: payload.loginUserId, Token: payload.token });
          payload.formData.Act = payload.formData.Act + '_NV';
        }
      }
    }

    //需token访问
    if (action.isTokenAccess && !payload.token) return;

    if (payload.userAgent) { headers = headers || {}; headers["User-Agent"] = payload.userAgent; }

    let data = {};
    if (payload.url !== undefined || payload.token !== undefined || payload.action !== undefined) {
      for (let key in payload) {
        if (key !== "url" && key !== "pathQuery" && key !== "token" && key !== "action" && key !== 'loginUserId') {
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
        return requestData(m.action || action, url2, m.data, m.dataKey || action.dataKey, m.serviceName || serviceName, m.headers || headers);
      }));
    }
    else return requestData(action, url, data, action.dataKey, serviceName, headers);
  }
  catch (error) {
    const res = { isSuccess: false, message: error.message || error };
    return Promise.resolve(res);
  }
}

function requestData(action, url, data, dataKey, serviceName, headers) {
  if (action.method === "GET") return request.get(url, dataKey, serviceName, headers);
  else if (action.method === "PUT") return request.put(url, data, dataKey, serviceName, headers);
  else if (action.method === "DELETE") return request.delete2(url, data, dataKey, serviceName, headers);
  else if (action.isFormData) return request.postFormData(url, data.formData, dataKey, serviceName, headers);
  else if (action.isUrlFormData) return request.postUrlFormData(url, data.formData, dataKey, serviceName, headers);
  else return request.post(url, data, dataKey, serviceName, headers);
}
