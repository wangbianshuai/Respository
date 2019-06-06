import DvaIndex from "DvaCommon";

const config = {
    Name: "UserCenterService",
        ServiceName: "UserCenterApiService",
        ActionList: [
            post("GetUserInfo", "user/edt/queryUserInfoForEdt", "UserInfo", "data", true),
            post("SaveUserInfo", "user/edt/saveUserBaseInfo", "SaveUserInfo", "data", true, true),
            post("GetAllIndustry", "user/edt/queryAllIndustry", "AllIndustry", "data"),
            post("GetCompanyInfo", "company/edt/queryCompanyInfoForEdt", "CompanyInfo", "data", true),
            post("SaveCompanyInfo", "company/edt/saveCompanyInfoForEdt", "SaveCompanyInfo", "data", true, true),
            post("GetCompanyAllIndustry", "company/edt/queryAllIndustry", "CompanyAllIndustry", "data"),
            post("CompanyRegister", "user/enterpriseRegist", "CompanyRegister", "data"),
            post("EnterpriseOpenAcntProgressQuery", "user/enterpriseCapitalAccountV2/enterpriseOpenAcntProgressQuery/staticPc", "EnterpriseOpenAcntProgressQuery", "data", true),
            post("DoCompanyRealname", "companyRealname/doCompanyRealname", "DoCompanyRealname", "data", true),
            post("DoManualCompanyRealname", "companyRealname/doManualCompanyRealname", "DoManualCompanyRealname", "data", true),
            post("AutoCompanyAppro", "company/autoCompanyAppro", "AutoCompanyAppro", "data", true),
            post("ManualCompanyAppro", "company/manualCompanyAppro", "ManualCompanyAppro", "data", true),
            get("GetBranchInfoByBranchCode", null, "BranchInfoByBranchCode", "data", true),
            post("AutoCompanyBankAppro", "company/bank/autoCompanyBankAppro", "AutoCompanyBankAppro", "data", true),
            post("ManualCompanyBankAppro", "company/bank/manualCompanyBankAppro", "ManualCompanyBankAppro", "data", true),
            get("QueryUserCompanyInfo", "user/queryUserCompanyInfo", "UserCompanyInfo", "data", true),
            get("GetFuiouDicCities", null, "FuiouDicCities", "data"),
            get("CheckBankNoIsUse", null, "CheckBankNoIsUse", "data", true),
            post("OpenFuiouOpenAccountPage", "user/enterpriseCapitalAccountV2/openFuiouOpenAccountPage/staticPc", "OpenFuiouOpenAccountPage", "data", true)
        ]
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

export default DvaIndex(config);
