import DvaIndex from "DvaCommon";

const config = {
    name: 'MatchmakerService',
    serviceName: 'ApiService',
    actionList: [
         //注册
         post('saveEntityData', 'Matchmaker/Register', 'saveEntityData', 'Data'),
        //获取用户红娘
        post('getUserMatchmaker', 'Matchmaker/GetUserMatchmaker', 'getUserMatchmaker'),
        //以openId获取红娘
        post('getMatchmakerByOpenId', 'Matchmaker/GetMatchmakerByOpenId', 'getMatchmakerByOpenId', 'Data'),
        //获取红娘信息
        post('getMatchmaker', 'Matchmaker/GetMatchmaker', 'getMatchmaker'),
        //获取红娘信息
        post('getEntityData', 'Matchmaker/GetMatchmakerInfo', 'getEntityData', 'MatchmakerInfo'),
        //更新红娘信息
        post('updateMatchmakerInfo', 'Matchmaker/UpdateMatchmakerInfo', 'updateMatchmakerInfo'),
         //获取相亲安排红娘信息
         post('getMatchmakerById', 'Matchmaker/GetMatchmakerById', 'getMatchmakerById'),
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
