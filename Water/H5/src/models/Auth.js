import DvaIndex from "DvaCommon";

const config = {
	Name: "AuthService",
	ServiceName: "AuthService",
	ActionList: [
		post("LoanLogin", 'login', "LoanLogin", null),
	]
}


function post(actionName, url, stateName, dataKey, isToken, isOperation) {
	return { ActionName: actionName, Url: url, StateName: stateName, DataKey: dataKey, IsToken: isToken, IsOperation: isOperation }
}



export default DvaIndex(config);
