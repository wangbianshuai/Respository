import DvaIndex from "DvaCommon";

const config = {
  name: 'LibraryService',
  serviceName: 'ApiService',
  actionList: [
    //全部
    post("searchQuery", "Handler.ashx", "searchQuery", 'Data', true),
    //搜索关键字
    post("searchKeyword", "Handler.ashx", "searchKeyword", 'Data', true),
    //Paper
    post("searchPaper", "Handler.ashx", "searchPaper", 'Data', true),
    //应用文档
    post("searchAppDocument", "Handler.ashx", "searchAppDocument", 'Data', true),
    //入门手册
    post("searchBaedeker", "Handler.ashx", "searchBaedeker", 'Data', true),
    //技术文档
    post("searchTechnique", "Handler.ashx", "searchTechnique", 'Data', true),
    //产品中心
    post("searchProduct", "Handler.ashx", "searchProduct", 'Data', true),
    //获取明细
    post('getEntityData', 'Handler.ashx', 'getEntityData', 'Data', true),
    //获取应用领域
    post('getApplications', 'CommonHandler.ashx', 'getApplications', 'Data'),
    //获取光谱技术
    post('getTechniques', 'CommonHandler.ashx', 'getTechniques', 'Data'),
    //获取推荐阅读
    post('getLibraryRelations', 'Handler.ashx', 'getLibraryRelations', 'Data', true),
    //获取文件查看html
    post('getFileHtml', 'Handler.ashx', 'getFileHtml', 'Data', true),
    //下载文件
    post('downloadFile', 'Handler.ashx', 'downloadFile', 'Data', true),
    //咨询
    post('consult', 'Handler.ashx', 'consult', 'Data', false, true),
  ]
};

function post(actionName, url, stateName, dataKey, hasToken, isToken) {
  return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, hasToken, isToken }
}

export default DvaIndex(config);