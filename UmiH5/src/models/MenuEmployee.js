import DvaIndex from "DvaCommon";

const config = {
    Name: "MenuEmployeeService",
    ServiceName: "ApiService",
    ActionList: [
        //获取员工信息
        post("GetEmployeeInfo", "api/GetEmployeeInfo", "GetEmployeeInfo", "data", true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);