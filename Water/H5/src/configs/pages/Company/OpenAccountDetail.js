import {AssignProporties} from "../Common";

const DataActionTypes = {
	OpenAccuontUserInfo:1302,
	OpenAccuontResult:1303,
	BankApproStatus:1304,
	UploadFileStatus:1305,
	GetOpenFuiouOpenAccountPageParams:1306
}

export default {
	Name: "OpenAccountDetail",
	Type: "View",
	SaveEntityDataActionType: DataActionTypes.GetOpenFuiouOpenAccountPageParams,
	GetEntityDataActionType: DataActionTypes.OpenAccuontUserInfo,
	Properties: AssignProporties({}, GetProperties())
}


function GetProperties() {
	const list = [];
	
	/*
	 法人姓名：王小明
	 证件号码：11052619990521141X
	 手机号码：186552556332
	 企业名称：莞市翰林电子材料股份有限公司
	 开户支行：广东省东莞市，中国工商银行，中国工商银行股份有限公司北京朝阳区高速公路指挥中心支行
	 对公账户：5526663356302141
	 用户属性：借款人
	 */
	//法人姓名
	list.push(GetProperty("frName", "法人姓名",''));
	//证件号码
	list.push(GetProperty("frIdNumber", "法人身份证号",''));
	//手机号码
	list.push(GetProperty("regMobile", "注册手机号码",''));
	//企业名称
	list.push(GetProperty("companyName", "企业名称",''));
	//用户属性
	list.push(GetProperty("userAttr", "用户属性",''));
	
	//开户银行
	list.push(GetProperty("bankName", "开户行",''));
	//开户银行
	list.push(GetProperty("branchName", "支行名称",''));
	//基本户账户
	list.push(GetProperty("companyBankno", "对公账户",''));
	
	return list;
}

function GetProperty(name, label,Value) {
	return { Name: name, Label: label ,Value, Type:'Description',IsView : true, };
}

