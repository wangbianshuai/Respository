import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageStatusService',
    serviceName: 'ApiService',
    actionList: [
        //保存相亲状态
        post('saveEntityData', 'MarriageStatus/SaveMarriageStatus', 'saveEntityData'),
        //获取相亲状态
        post('getEntityData', 'MarriageStatus/GetMarriageStatus', 'getEntityData'),
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
