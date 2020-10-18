import DvaIndex from "DvaCommon";

const config = {
  name: 'HomeService',
  serviceName: 'ApiService',
  actionList: [
    post("getBannersList", "Handler.ashx", "getBannersList", 'Data'),
    post('getTopActivities', 'Handler.ashx', 'getTopActivities', 'Data'),
    post('getTopClassRoom', 'Handler.ashx', 'getTopClassRoom', 'Data'),
    post('getTopEdgeApp', 'Handler.ashx', 'getTopEdgeApp', 'Data'),
    post('getTopBook', 'Handler.ashx', 'getTopBook', 'Data'),
    post('getTopProductCenter', 'Handler.ashx', 'getTopProductCenter', 'Data')
  ]
}
function post(actionName, url, stateName, dataKey, isToken) {
  return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, isToken }
}

export default DvaIndex(config);
