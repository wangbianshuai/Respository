import DvaIndex from "DvaCommon";

const config = {
  name: 'FootmarkService',
  serviceName: 'ApiService',
  actionList: [
    post("searchQuery", "Handler.ashx", "searchQuery", 'Data', true),
    //文献历史
    post("searchLibraryHistory", "Handler.ashx", "searchLibraryHistory", 'Data', false, true),
    //活动历史
    post("searchActivityHistory", "Handler.ashx", "searchActivityHistory", 'Data', false, true),
    //云课堂历史
    post("searchVideoHistory", "Handler.ashx", "searchVideoHistory", 'Data', false, true),
  ]
}
function post(actionName, url, stateName, dataKey, hasToken, isToken) {
  return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, hasToken, isToken }
}

export default DvaIndex(config);
