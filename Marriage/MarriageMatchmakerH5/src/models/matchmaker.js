import DvaIndex from "DvaCommon";

const config = {
    name: 'MatchmakerService',
    serviceName: 'ApiService',
    actionList: [
         //注册
         post('saveEntityData', 'Matchmaker/Register', 'saveEntityData', 'Data'),
        //获取用户红娘
        post('getUserMatchmaker', 'Matchmaker/GetUserMatchmaker', 'getUserMatchmaker')
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
