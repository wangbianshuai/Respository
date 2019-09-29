import DvaIndex from "DvaCommon";

const config = {
    Name: "ContactService",
    ServiceName: "ApiService",
    ActionList: [
        //获取公司联系人核实
        post("GetCompanyContactCheck", "loanapproval/firstApproval/phoneCheck/query", "GetCompanyContactCheck", "data", true),
        //保存公司联系人核实
        post("SaveCompanyContactCheck", "loanapproval/firstApproval/phoneCheck/save", "SaveCompanyContactCheck", null, true, true),
        //获取亲属联系人核实
        post("GetKinsfolkContactCheck", "loanapproval/firstApproval/phoneCheck/query", "GetKinsfolkContactCheck", "data", true),
        //获取亲属联系人核实
        post("SaveKinsfolkContactCheck", "loanapproval/firstApproval/phoneCheck/save", "SaveKinsfolkContactCheck", null, true, true),
        //获取本人核实
        post("GetOwnerContactCheck", "loanapproval/firstApproval/phoneCheck/query", "GetOwnerContactCheck", "data", true),
        //保存本人核实
        post("SaveOwnerContactCheck", "loanapproval/firstApproval/phoneCheck/save", "SaveOwnerContactCheck", null, true, true),
        //获取同事联系核实
        post("GetWorkmateContactCheck", "loanapproval/firstApproval/phoneCheck/query", "GetWorkmateContactCheck", "data", true),
        //保存同事联系核实
        post("SaveWorkmateContactCheck", "loanapproval/firstApproval/phoneCheck/save", "SaveWorkmateContactCheck", null, true, true)
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);