import BaseIndex from "../../BaseIndex";
import { Common } from "UtilsCommon";

export default class AccountInfoAuth extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Company_AccountInfoAuth";
		
		this.MinActionType = 1200;
		this.MaxActionType = 1299;
		
		this.Init();
	}
	
	GetStateActionTypes() {
		const { AutoCompanyBankAppro, GetBranchInfoByBranchCode, CheckBankNoIsUse  } = this.ActionTypes;
		
		return {
			AutoCompanyBankAppro: [AutoCompanyBankAppro],
			ManualCompanyBankAppro: [AutoCompanyBankAppro],
			BranchInfoByBranchCode: [GetBranchInfoByBranchCode],
			CheckBankNoIsUse: [CheckBankNoIsUse]
		}
	}
	
	Invoke(id, actionType, data) {
		
		const { AutoCompanyBankAppro, GetBranchInfoByBranchCode, CheckBankNoIsUse,EnterpriseOpenAcntProgressQuery } = this.ActionTypes;
		
		switch (actionType) {
			case AutoCompanyBankAppro: this.AutoCompanyBankAppro(id, actionType, data); break;
			case CheckBankNoIsUse: this.CheckBankNoIsUse(id, actionType, data); break;
			case GetBranchInfoByBranchCode: this.GetBranchInfoByBranchCode(id, actionType, data); break;
			case EnterpriseOpenAcntProgressQuery:this.EnterpriseOpenAcntProgressQuery(id, actionType, data);break;
			default:this.Dispatch(id, actionType, data);break;
		}
	}
	
	SetResponseData(id, actionType, data) {
		
		const { AutoCompanyBankAppro} = this.ActionTypes;
		switch (actionType) {
			case AutoCompanyBankAppro: return this.SetAutoCompanyAppro(data);
			default: return this.SetApiResponse(data);
		}
	}
	
	EnterpriseOpenAcntProgressQuery(id, actionType, data) {
		this.DvaActions.Dispatch("UserCenterService", "EnterpriseOpenAcntProgressQuery", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
	SetAutoCompanyAppro(data) {
		data = this.SetApiResponse(data);
		if (data.IsSuccess === false) data.IsValidate = false;
		let isToArtificial = false;
		if (data.Action) isToArtificial = data.Action.isToArtificial;
		
		if (data.Data && Common.GetIntValue(data.Data.code) === "-4") return { IsSuccess: false, isToArtificial, Code: -4, Message: data.Data.message }
		
		data.isToArtificial = isToArtificial;
		return data;
	}
	
	CheckBankNoIsUse(id, actionType, data) {
		let msg = this.ValidateIdNumber(data.comBankNo);
		
		if (msg) this.Dispatch(id, actionType, { IsSuccess: false, Message: msg });
		else {
			const url = `company/bank/checkBankNoIsUse?bankNo=` + data.comBankNo;
			this.DvaActions.Dispatch("UserCenterService", "CheckBankNoIsUse", { Url: url, Action: this.GetAction(id, actionType) });
		}
	}
	
	AutoCompanyBankAppro(id, actionType, data) {
		let msg = this.ValidateBranchCode(data.branchCode);
		if (!msg) msg = this.ValidateIdNumber(data.comBankNo);
			
		if (data.isToArtificial) {
			if (!msg && Common.IsNullOrEmpty(data.openAccAppro_pic)) msg = "基本户请上传开户许可证，一般户请上传印鉴卡";
		}
		
		if (msg) this.Dispatch(id, actionType, { IsSuccess: false, Message: msg, IsValidate: false });
		else {
			const methodName = data.isToArtificial ? "ManualCompanyBankAppro" : "AutoCompanyBankAppro";
			const action = this.GetAction(id, actionType);
			action.isToArtificial = data.isToArtificial;
			delete data.isToArtificial;
			// console.log(data)
			this.DvaActions.Dispatch("UserCenterService", methodName, { data: data, Action: action });
		}
	}
	
	GetBranchInfoByBranchCode(id, actionType, data) {
		// console.log(data)
		let msg = this.ValidateBranchCode(data.branchCode);
		// console.log(msg)
		if (msg) this.Dispatch(id, actionType, { IsSuccess: false, Message: msg });
		else {
			const url = `company/bank/getBranchInfoByBranchCode?branchCode=` + data.branchCode;
			// // const url = `company/bank/getBranchInfoByBranchCode?branchCode=`;
			this.DvaActions.Dispatch("UserCenterService", "GetBranchInfoByBranchCode", { Url: url, Action: this.GetAction(id, actionType) });
		}
	}
	
	ValidateIdNumber(value) {
		let msg = "";
		
		if (Common.IsNullOrEmpty(value)) msg = "请输入基本户或一般户银行卡号";
		
		return msg;
	}
	
	ValidateBranchCode(value) {
		let msg = "";
		
		if (Common.IsNullOrEmpty(value)) msg = "请输入联行号";
		
		return msg;
	}
}
