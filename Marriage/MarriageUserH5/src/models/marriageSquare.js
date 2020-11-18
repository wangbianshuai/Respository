import DvaIndex from "DvaCommon";

const config = {
    name: 'MarriageSquareService',
    serviceName: 'ApiService',
    actionList: [
        //相亲广场
        post('searchQuery', 'MarriageSquare/QueryMarriageSquare', 'searchQuery'),
        //赠送玫瑰
        post('searchSend', 'MarriageSquare/QueryMarriageSquare', 'searchSend'),
        //收到玫瑰
        post('searchReceive', 'MarriageSquare/QueryMarriageSquare', 'searchReceive'),
        //互赠玫瑰
        post('searchMutual', 'MarriageSquare/QueryMarriageSquare', 'searchMutual')
    ]
}
function post(actionName, url, stateName, dataKey) {
    return { actionName, url, method: "POST", stateName, dataKey }
}

export default DvaIndex(config);
