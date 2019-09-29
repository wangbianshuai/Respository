import DvaIndex from "DvaCommon";

const config = {
    Name: "LoanApplyPlatformService",
    ServiceName: "LoanApplyPlatformApiService",
    ActionList: [
        //省市
        post("GetProvincesAndCitys", "loanapply/queryAllProvincesAndCitys", "GetProvincesAndCitys", "data")
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);