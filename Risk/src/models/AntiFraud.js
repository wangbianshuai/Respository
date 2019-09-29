import DvaIndex from "DvaCommon";

const config = {
    Name: "AntiFraudService",
    ServiceName: "ApiService",
    ActionList: [
        //1.	白骑士
        post("GetBaiqishi", "fraud/geren/baiqishi", "GetBaiqishi", "data", true),
        //2.	汇法
        post("GetHuifa", "fraud/geren/huifa", "GetHuifa", "data", true),
        //3.	百融申请
        post("GetBairongApply", "fraud/geren/bairong/apply", "GetBairongApply", "data", true),
        //4.	百融特殊
        post("GetBairongSpecial", "fraud/geren/bairong/special", "GetBairongSpecial", "data", true),
        //5.	同盾
        post("GetTongdun", "fraud/geren/tongdun", "GetTongdun", "data", true),
        //6.	鹏元
        post("GetPengyuan", "fraud/geren/pengyuan", "GetPengyuan", "data", true),
        //7.	中互金协会
        post("GetZhonghujin", "fraud/geren/zhonghujin", "GetZhonghujin", "data", true),
        //8.	汇法
        post("GetCompanyHuifa", "fraud/qiye/huifa", "GetCompanyHuifa", "data", true),
        //9.	鹏元企业
        post("GetCompanyPengyuan", "fraud/qiye/pengyuan", "GetCompanyPengyuan", "data", true),
        //10、交叉验证
        post("GetFraudVerify", "fraud/platfrom/verify", "GetFraudVerify", "data", true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);