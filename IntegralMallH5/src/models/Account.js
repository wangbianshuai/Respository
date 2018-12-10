import Index from "./Index"
import * as Common from "../utils/Common"

function InitModel() {
    const obj = new Index({
        Name: "Account",
        ActionList: [{ ActionName: "UserAccess", Url: "AppAccess/UserAccess", StateName: "UserInfo" },
        { ActionName: "SetUserInfoAccessToken", StateName: "UserInfoAccessToken" },
        { ActionName: "GetAccountIntegralBalance", Url: "Account/GetAccountIntegralBalance", StateName: "AccountIntegralBalance" },
        { ActionName: "MyCredit", Url: "MyCredit/GetMyCreditDetail", StateName: "MyCreditDetails" }]
    })
    return Common.ToModels(obj)
}

export default InitModel()