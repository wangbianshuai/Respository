import DvaIndex from "DvaCommon";

const config = {
    Name: "ContactService",
    ServiceName: "ApiService",
    ActionList: [
        //获取公司联系人核实
        post("GetCompanyContactCheck", "GetCompanyContactCheck", "GetCompanyContactCheck", "data"),
        //保存公司联系人核实
        post("SaveCompanyContactCheck", "SaveCompanyContactCheck", "SaveCompanyContactCheck", "data"),
        //获取亲属联系人核实
        post("GetKinsfolkContactCheck", "GetKinsfolkContactCheck", "GetKinsfolkContactCheck", "data"),
        //获取亲属联系人核实
        post("SaveKinsfolkContactCheck", "SaveKinsfolkContactCheck", "SaveKinsfolkContactCheck", "data"),
        //获取本人核实
        post("GetOwnerContactCheck", "GetOwnerContactCheck", "GetOwnerContactCheck", "data"),
        //保存本人核实
        post("SaveOwnerContactCheck", "SaveOwnerContactCheck", "SaveOwnerContactCheck", "data"),
        //获取同事联系核实
        post("GetWorkmateContactCheck", "GetWorkmateContactCheck", "GetWorkmateContactCheck", "data"),
        //保存同事联系核实
        post("SaveWorkmateContactCheck", "SaveWorkmateContactCheck", "SaveWorkmateContactCheck", "data")
    ]
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);