import DvaIndex from "DvaCommon";

const config = {
	Name: "RiskControlApprovalService",
	ServiceName: "RiskControlApprovalService",
	ActionList:
	[
		//查询征信授权
		post("QueryCreditAuthorize", 'loanapply/queryCreditAuthorize', "QueryCreditAuthorize", "data"),
		//发送短信验证码 /loanapply/sendSmsCheckcodeForAuthorize
		// post("sendCreditAuthorizeSms", 'loanapply/sendCreditAuthorizeSms', "sendCreditAuthorizeSms", "data"),
		post("sendCreditAuthorizeSms", 'loanapply/sendSmsCheckcodeForAuthorize', "sendCreditAuthorizeSms", "data"),
		
		//确认征信授权
		post("creditAuthorize", 'loanapply/creditAuthorize', "creditAuthorize", "data"),
	]
}


function post(actionName, url, stateName, dataKey, isToken, isOperation) {
	return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}



export default DvaIndex(config);

