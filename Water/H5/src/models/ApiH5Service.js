import DvaIndex from "DvaCommon";

const config = {
    Name: "ApiH5Service",
    ServiceName: "ApiH5Service",
    ActionList: [
        get("CheckPhoneUnique", "users/check/unique", "CheckPhoneUnique", "data"),
        postUrlFormData("SendTextVerifyCode", "sms/send-message", "SendTextVerifyCode", "data"),
        postUrlFormData("SendVoiceVerifyCode", "sms/send-voice", "SendVoiceVerifyCode", "data"),
        postUrlFormData("RegisterUser", "users/register", "RegisterUser", "data"),
		get("UserInfo", "users/info", "UserInfo", "data", true), //  用户信息
        postUrlFormData("UserRealName", "accounts/approve", "UserRealName", "data", true), //  实名认证
        get("GetUserAccount", "accounts", "UserAccount", "data", true), ////  用户已开户获取用户信息
        setClientId(get("GetFuyouJump", null, "FuyouJump", "data", true), "XXD_EDT_H5")   ////  富友跳转
    ]
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}

function postUrlFormData(actionName, url, stateName, dataKey, isToken) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: true, IsUrlFormData: true }
}

function setClientId(action, clientId) {
    action.ClientId = clientId;
    return action;
}

export default DvaIndex(config);
