import DvaIndex from "DvaCommon";

const config = {
    name: 'GiftService',
    serviceName: 'ApiService',
    actionList: [
        //礼品
        post("searchQuery", "Handler.ashx", "searchQuery", 'Data'),
        //购物车
        post("getGiftCart", "Handler.ashx", "getGiftCart", 'Data', false, true),
        //订单
        post("searchOrder", "Handler.ashx", "searchOrder", 'Data', false, true),
        //获取详情
        post('getEntityData', 'Handler.ashx', 'getEntityData', 'Data'),
        //加入购物车
        post("addCart", "Handler.ashx", "addCart", 'Data', false, true),
        //移除购物车
        post("removeCart", "Handler.ashx", "removeCart", 'Data', false, true),
        //创建订单
        post("createOrder", "Handler.ashx", "createOrder", 'Data', false, true),
    ]
};

function post(actionName, url, stateName, dataKey, hasToken, isToken) {
    return { actionName, isFormData: true, url, method: "POST", stateName, dataKey, hasToken, isToken }
}

export default DvaIndex(config);