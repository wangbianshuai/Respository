import BaseIndex from "../../BaseIndex";

export default class AuthIndex extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Company_AuthIndex";
		this.MinActionType = 1400;
		this.MaxActionType = 1499;
		
		this.Init();
	}
	
	GetStateActionTypes() {
		const { userInfoRate } = this.ActionTypes;
		
		return {
			GetEntityData: [userInfoRate],
		}
	}
	
	Invoke(id, actionType, data) {
		const { userInfoRate } = this.ActionTypes;
		
		switch (actionType) {
			case userInfoRate:
				this.userInfoRate(id, actionType, data);
				break;
			default: this.Dispatch(id, actionType, data); break;
		}
	}
	
	SetResponseData(id, actionType, data) {
		const { userInfoRate } = this.ActionTypes;
		switch (actionType) {
			case userInfoRate: return this.SetApiResponse(data);
			default: return this.SetApiResponse(data);
		}
	}
	
	userInfoRate(id, actionType, data) {
		this.DvaActions.Dispatch("UserCenterService", "userInfoRate", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
	SetGetEntityData(id, actionType, data){
		
	}
	
}
