import DvaIndex from "DvaCommon";

const config = {
    name: 'MatchmakerService',
    serviceName: 'ApiService',
    actionList: [
        //获取用户红娘
        post('getUserMatchmaker', 'Matchmaker/GetUserMatchmaker', 'getUserMatchmaker'),
        //获取平台红娘
        post('getAppMatchmaker', 'Matchmaker/GetAppMatchmaker', 'getAppMatchmaker')
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
