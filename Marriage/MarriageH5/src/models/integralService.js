import DvaIndex from "DvaCommon";

const config = {
    name: 'IntegralService',
    serviceName: 'ApiService',
    actionList: [
        //全部
        post("searchQuery", "Handler.ashx", "searchQuery", 'Data'),
        //积分历史
        post("searchHistory", "Handler.ashx", "searchHistory", 'Data', false, true),
        //索取积分
        post("searchGet", "Handler.ashx", "searchGet", 'Data', false, true),
        post('getEntityData', 'Handler.ashx', 'getEntityData', 'Data', false, true),
        post('saveEntityData', 'Handler.ashx', 'saveEntityData', 'Data', false, true),
        post('deleteEntityData', 'Handler.ashx', 'deleteEntityData', 'Data', false, true),
        post("searchQuestionnaire", "Handler.ashx", "searchQuestionnaire", 'Data', false, true), 
        post("searchExperience", "Handler.ashx", "searchExperience", 'Data', false, true), 
        post("searchDocument", "Handler.ashx", "searchDocument", 'Data', false, true), 
    ]
};

function post(actionName, url, stateName, dataKey, hasToken, isToken) {
    return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, hasToken, isToken }
}

export default DvaIndex(config);