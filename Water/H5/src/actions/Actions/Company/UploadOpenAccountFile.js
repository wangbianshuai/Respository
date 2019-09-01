import BaseIndex from "../../BaseIndex";

export default class UploadOpenAccountFile extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Company_UploadOpenAccountFile";
		this.MinActionType = 1500;
		this.MaxActionType = 1599;
		
		this.Init();
	}
	
	GetStateActionTypes() {
		const { GetEntityData, SaveEntityData } = this.ActionTypes;
		
		return {
			GetEntityData: [GetEntityData],
			SaveEntityData: [SaveEntityData]
		}
	}
	
	Invoke(id, actionType, data) {
		const { GetEntityData, SaveEntityData } = this.ActionTypes;
		switch (actionType) {
			case GetEntityData: this.GetFilesStatus(id, actionType, data); break;
			case SaveEntityData: this.SaveEntityData(id, actionType, data); break;
			default: this.Dispatch(id, actionType, data); break;
		}
	}
	
	SetResponseData(id, actionType, data) {
		// return this.SetApiResponse(data);
		const { GetEntityData } = this.ActionTypes;

		switch (actionType) {
			case GetEntityData: return this.SetGetFilesStatus(id, actionType, data);
			default: return this.SetApiResponse(data);
		}
	}
	
	//获取实体数据
	GetFilesStatus(id, actionType, data) {
		this.DvaActions.Dispatch("UserCenterService", "GetCompanyUploadFiles", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
	//保存实体数据
	SaveEntityData(id, actionType, data) {
		let item = {files:[]};
		item.files = data;
		console.log(item);
		this.DvaActions.Dispatch("UserCenterService", "SaveCompanyUploadFiles", { data: item, Action: this.GetAction(id, actionType) });
	}
	
	SetGetFilesStatus(id, actionType, data){
		// console.log(data)
		data = this.SetApiResponse(data);
		return data;
	}
	
}