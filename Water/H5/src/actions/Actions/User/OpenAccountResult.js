import BaseIndex from "../../BaseIndex";

export default class OpenAccountResult extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "User_OpenAccountResult";
		this.MinActionType = 2100;
		this.MaxActionType = 2199;
		
		this.Init();
	}
	
	GetStateActionTypes() {
		const {UserInfo} = this.ActionTypes;
		
		return {
			GetEntityData: [UserInfo],
		}
	}
	
	Invoke(id, actionType, data) {
		const {UserInfo} = this.ActionTypes;
		
		switch (actionType) {
			case UserInfo: this.getUserInfo(id, actionType, data); break;
			default: break;
		}
	}
	
	//用户是否实名认证
	getUserInfo(id, actionType, data){
		this.DvaActions.Dispatch("ApiH5Service", "UserInfo", { Action: this.GetAction(id, actionType) });
	}
	
}
