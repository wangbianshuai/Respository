import DvaIndex from "DvaCommon";

const config = {
    Name: "UserCenterService",
        ServiceName: "UserCenterApiService",
        ActionList: [
            // post("GetUserInfo", "user/edt/queryUserInfoForEdt", "UserInfo", "data", true),
            // post("SaveUserInfo", "user/edt/saveUserBaseInfo", "SaveUserInfo", "data", true, true),
            // post("GetAllIndustry", "user/edt/queryAllIndustry", "AllIndustry", "data"),

            // post("GetCompanyInfo", "company/edt/queryCompanyInfoForEdt", "CompanyInfo", "data", true),
            // post("SaveCompanyInfo", "company/edt/saveCompanyInfoForEdt", "SaveCompanyInfo", "data", true, true),
            // post("GetCompanyAllIndustry", "company/edt/queryAllIndustry", "CompanyAllIndustry", "data"),
            // post("CompanyRegister", "user/enterpriseRegist", "CompanyRegister", "data"),
			//认证状态
            post("EnterpriseOpenAcntProgressQuery", "user/enterpriseCapitalAccountV2/enterpriseOpenAcntProgressQuery/staticPc", "EnterpriseOpenAcntProgressQuery", "data", true),
			//借款人实名认证
			post("Realname", "user/appro/autoRealname", "DoRealname", "data", true),
			post("ManualRealname", "user/appro/manualRealname", "DoManualRealname", "data", true),
			get("RealNameStatus", "user/appro/realnameStatus", "DoRealnameStatus", "data", true),
			
			//法人实名认证
            post("DoCompanyRealname", "companyRealname/doCompanyRealname", "DoCompanyRealname", "data", true),
            post("DoManualCompanyRealname", "companyRealname/doManualCompanyRealname", "DoManualCompanyRealname", "data", true),
			//公司实名认证
            post("AutoCompanyAppro", "company/autoCompanyAppro", "AutoCompanyAppro", "data", true),
            post("ManualCompanyAppro", "company/manualCompanyAppro", "ManualCompanyAppro", "data", true),
			//根据联行号查询企业对公户信息
            get("GetBranchInfoByBranchCode", null, "BranchInfoByBranchCode", "data", true),
			//对公信息认证
            post("AutoCompanyBankAppro", "company/bank/autoCompanyBankAppro", "AutoCompanyBankAppro", "data", true),
            post("ManualCompanyBankAppro", "company/bank/manualCompanyBankAppro", "ManualCompanyBankAppro", "data", true),
			//企业信息
			// get("QueryUserCompanyInfo", "user/queryUserCompanyInfo", "UserCompanyInfo", "data", true),
			//富友支持的银行卡地区
            get("GetFuiouDicCities", null, "FuiouDicCities", "data"),
			//检查银行卡号是否被使用
            get("CheckBankNoIsUse", null, "CheckBankNoIsUse", "data", true),
            post("OpenFuiouOpenAccountPage", "user/enterpriseCapitalAccountV2/openFuiouOpenAccountPage/staticPc", "OpenFuiouOpenAccountPage", "data", true),
			
			//用户基本信息进度
			get("userInfoRate", "user/userInfoRate", "userInfoRate", "data",true),
			//注册
			post("EdtRegister", "user/edt/register", "Register", "data"),
			//借款人基本信息房产车产联系人获取和保存
			get("GetLoanBasicInfo", "user/baseInfo/edt/get", "LoanBasicInfo", "data", true),
			post("SaveLoanBasicInfo", "user/baseInfo/edt/save", "SaveLoanBasicInfo", "data", true),
			get("GetLoanContactInfo", "user/contact/edt/get", "LoanContactInfo", "data", true),
			post("SaveLoanContactInfo", "user/contact/edt/save", "SaveLoanContactInfo", "data", true),
			
			get("GetLoanHouseInfo", "user/house/edt/get", "LoanHouseInfo", "data", true),
			post("SaveLoanHouseInfo", "user/house/edt/save", "SaveLoanHouseInfo", "data", true),
			post("RemoveLoanHouseInfo", "user/house/edt/del", "RemoveLoanHouseInfo", "data", true),
	
			get("GetLoanCarInfo", "user/car/edt/get", "LoanCarInfo", "data", true),
			post("SaveLoanCarInfo", "user/car/edt/save", "SaveLoanCarInfo", "data", true),
			post("RemoveLoanCarInfo", "user/car/edt/del", "RemoveLoanCarInfo", "data", true),
			
			//企业基本信息获取与保存
			get("GetCompanyBasicInfo", "user/company/edt/get", "CompanyBasicInfo", "data", true),
			post("SaveCompanyBasicInfo", "user/company/edt/save", "SaveCompanyBasicInfo", "data", true),
			//网查复核结果和提交
			get("GetQzwcResult", "qzwc/edt/result", "QzwcResult", "data", true),
			post("ApplyQzwcResult", "qzwc/edt/apply", "ApplyQzwcResult", "data", true),
			
			//企业开户基本信息
			get("GetOpenAccuontUserInfo", "user/edt/userInfo", "OpenAccuontUserInfo", "data", true),
			//开户附件资料上传
			// postFormData("SaveCompanyUploadFiles", 'company/file/upload', "SaveCompanyUploadFiles", "data"),
			post("SaveCompanyUploadFiles", 'company/file/save', "SaveCompanyUploadFiles", "data",true),
			//开户附件资料获取
			get("GetCompanyUploadFiles", 'company/file/get', "CompanyUploadFiles", "data",true),
			//企业对公信息认证状态 信息获取
			get("GetBankAppro", 'user/bankAppro', "BankAppro", "data",true),
			//获取企业开户提交数据
			post("OpenFuiouOpenAccountInfo", 'openAccuont/edt/company', "OpenFuiouOpenAccountInfo", "data", true),
			///开户结果页面,开户状态，附件上传状态
			post("GetOpenAccuontResult", 'openAccuont/edt/company/result', "OpenAccuontResult", "data", true),
			
			get("GetIndustryLeveOne", 'industry/leveOne', "IndustryLeveOne", "data",false),
			get("GetIndustryLeveTwo", null, "IndustryLeveTwo", "data",false),
			get("GetIndustryLeveThree", null, "IndustryLeveThree", "data",false),
			get("GetIndustryLeveFour", null, "IndustryLeveFour", "data",false),
        ]
}

function get(actionName, url, stateName, dataKey, isToken, hasToken) {
    return { ActionName: actionName, Url: url, Method: "GET", StateName: stateName, DataKey: dataKey, IsToken: isToken, HasToken: hasToken }
}

function post(actionName, url, stateName, dataKey, isToken, isOperation) {
    return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}

// function postFormData(actionName, url, stateName, dataKey, isToken) {
// 	return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: true, IsFormData: true }
// }

export default DvaIndex(config);
