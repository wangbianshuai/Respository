import DvaIndex from "DvaCommon";

const config = {
  name: 'NewsService',
  serviceName: 'ApiService',
  actionList: [
    //全部
    post("searchQuery", "Handler.ashx", "searchQuery", 'Data'),
    //活动报道
    post("searchActivity", "Handler.ashx", "searchActivity", 'Data'),
    //行业动态
    post("searchIndustry", "Handler.ashx", "searchIndustry", 'Data'),
    //技术资讯
    post("searchTechnical", "Handler.ashx", "searchTechnical", 'Data'),
    //微课堂
    post("searchClassroom", "Handler.ashx", "searchClassroom", 'Data'),
    //技术进阶
    post("searchAdvanced", "Handler.ashx", "searchAdvanced", 'Data'),
    //光谱学院
    post("searchSpectral", "Handler.ashx", "searchSpectral", 'Data'),
    //其他
    post("searchOther", "Handler.ashx", "searchOther", 'Data'),
    //获取明细
    post('getEntityData', 'Handler.ashx', 'getEntityData', 'Data'),
  ]
}

function post(actionName, url, stateName, dataKey, isToken) {
  return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, isToken }
}

export default DvaIndex(config);
