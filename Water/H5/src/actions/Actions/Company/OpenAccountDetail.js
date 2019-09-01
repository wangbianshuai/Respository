import BaseIndex from "../../BaseIndex";
import { Common } from "UtilsCommon";

export default class OpenAccountDetail extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Company_OpenAccountDetail";
		this.MinActionType = 1300;
		this.MaxActionType = 1399;
		
		this.Init();
	}
	
	GetStateActionTypes() {
		const {OpenAccuontUserInfo, OpenAccuontResult, bankApproStatus} = this.ActionTypes;
		
		return {
			OpenAccuontUserInfo: [OpenAccuontUserInfo],
			OpenAccuontResult: [OpenAccuontResult],
			bankApproStatus: [bankApproStatus]
		}
	}
	
	Invoke(id, actionType, data) {
		const {OpenAccuontUserInfo, OpenAccuontResult, BankApproStatus, UploadFileStatus,GetOpenFuiouOpenAccountPageParams} = this.ActionTypes;
		
		switch (actionType) {
			case OpenAccuontUserInfo: this.GetOpenAccuontUserInfo(id, actionType, data); break;
			case OpenAccuontResult: this.GetOpenAccuontResult(id, actionType, data); break;
			case BankApproStatus: this.BankApproStatus(id, actionType, data); break;
			case UploadFileStatus: this.UploadFileStatus(id, actionType, data); break;
			case GetOpenFuiouOpenAccountPageParams: this.GetOpenFuiouOpenAccountPage(id, actionType, data); break;
			default:this.Dispatch(id, actionType, data);break;
		}
	}
	
	SetResponseData(id, actionType, data) {
		const {GetOpenFuiouOpenAccountPageParams} = this.ActionTypes;
		
		switch (actionType) {
			case GetOpenFuiouOpenAccountPageParams: return this.SetGetOpenFuiouOpenAccountPageParams(id, actionType, data);
			default: return this.SetApiResponse(data);
		}
	}
	
	GetOpenAccuontUserInfo(id, actionType, data){
		data = {};
		this.DvaActions.Dispatch("UserCenterService", "GetOpenAccuontUserInfo", { data: data, Action: this.GetAction(id, actionType) });
	}
	
	GetOpenAccuontResult(id, actionType, data){
		
		this.DvaActions.Dispatch("UserCenterService", "GetOpenAccuontResult", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
	BankApproStatus(id, actionType, data){
		this.DvaActions.Dispatch("UserCenterService", "GetBankAppro", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
	UploadFileStatus(id, actionType, data){
		
		this.DvaActions.Dispatch("UserCenterService", "GetCompanyUploadFiles", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
	GetOpenFuiouOpenAccountPage(id, actionType, data){
		this.DvaActions.Dispatch("UserCenterService", "OpenFuiouOpenAccountInfo", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
	SetGetOpenFuiouOpenAccountPageParams(id, actionType, data){
		//跳转去富友
		
		if (data.Data) data = data.Data;
		
		data.fuiou_open_capital_account_page_url && Common.SumbitForm(data.fuiou_open_capital_account_page_url, data.fuiouParams);
		
		// return true;
		// return false;
	}
	
}