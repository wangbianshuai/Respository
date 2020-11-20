import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageFeeService',
    serviceName: 'ApiService',
    actionList: [
        //保存相亲费用
        post('saveEntityData', 'MarriageFee/SaveMarriageFee', 'saveEntityData'),
        //获取相亲费用
        post('getEntityData', 'MarriageFee/GetMarriageFee', 'getEntityData'),
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
