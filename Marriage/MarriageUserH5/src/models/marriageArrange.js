import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageArrangeService',
    serviceName: 'ApiService',
    actionList: [
        //待相亲
        post('searchQuery', 'MarriageArrange/QueryMarriageArrange', 'searchQuery'),
        //有意向
        post('searchLike', 'MarriageArrange/QueryMarriageArrange', 'searchLike'),
        //牵手成功
        post('searchMarriage', 'MarriageArrange/QueryMarriageArrange', 'searchMarriage'),
        //无意向
        post('searchDislike', 'MarriageArrange/QueryMarriageArrange', 'searchDislike'),
        //获取相亲安排
        post('getEntityData', 'MarriageArrange/GetMarriageArrangeByUser', 'getEntityData'),
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
