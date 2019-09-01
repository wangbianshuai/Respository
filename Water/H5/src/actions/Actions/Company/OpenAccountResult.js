import BaseIndex from "../../BaseIndex";
// import { Common } from "UtilsCommon";

export default class OpenAccountResult extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Company_OpenAccountResult";
		this.MinActionType = 2000;
		this.MaxActionType = 2099;
		
		this.Init();
	}
	
	GetStateActionTypes() {
		const {OpenAccuontResult} = this.ActionTypes;
		
		return {
			OpenAccuontResult: [OpenAccuontResult],
		}
	}
	
	Invoke(id, actionType, data) {
		const { OpenAccuontResult, UploadFileStatus} = this.ActionTypes;
		
		switch (actionType) {
			case OpenAccuontResult: this.GetOpenAccuontResult(id, actionType, data); break;
			case UploadFileStatus: this.UploadFileStatus(id, actionType, data); break;
			default:this.Dispatch(id, actionType, data);break;
		}
	}
	
	SetResponseData(id, actionType, data) {
		
		return this.SetApiResponse(data);
	}
	
	
	GetOpenAccuontResult(id, actionType, data){
		
		this.DvaActions.Dispatch("UserCenterService", "GetOpenAccuontResult", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
	
	UploadFileStatus(id, actionType, data){
		
		this.DvaActions.Dispatch("UserCenterService", "GetCompanyUploadFiles", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
	
	
}