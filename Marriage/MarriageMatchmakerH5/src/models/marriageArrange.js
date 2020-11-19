import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageArrangeService',
    serviceName: 'ApiService',
    actionList: [
        //待相亲
        post('searchQuery', 'MarriageArrange/QueryMarriageArrangeByMatchmaker', 'searchQuery'),
        //有意向
        post('searchLike', 'MarriageArrange/QueryMarriageArrangeByMatchmaker', 'searchLike'),
        //牵手成功
        post('searchMarriage', 'MarriageArrange/QueryMarriageArrangeByMatchmaker', 'searchMarriage'),
        //无意向
        post('searchDislike', 'MarriageArrange/QueryMarriageArrangeByMatchmaker', 'searchDislike'),
        //获取相亲安排
        post('getEntityData', 'MarriageArrange/GetMarriageArrangeByMatchmaker', 'getEntityData'),
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
