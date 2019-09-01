import BaseIndex from "../../BaseIndex";
// import { Common} from "UtilsCommon";

export default class ReviewResult extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Loan_ReviewResult";
		this.MinActionType = 1600;
		this.MaxActionType = 1699;
		
		this.Init();
	}
	
	GetStateActionTypes() {
		const { GetResult, ApplyEntityData } = this.ActionTypes;
		
		return {
			GetResult: [GetResult],
			ApplyEntityData: [ApplyEntityData]
		}
	}
	
	Invoke(id, actionType, data) {
		const { GetResult, ApplyEntityData } = this.ActionTypes;
		
		switch (actionType) {
			case GetResult: this.GetResultData(id, actionType, data); break;
			case ApplyEntityData: this.ApplyEntityData(id, actionType, data); break;
			default: this.Dispatch(id, actionType, data); break;
		}
	}
	
	SetResponseData(id, actionType, data) {
		return this.SetApiResponse(data);
	}
	
	//获取实体数据
	GetResultData(id, actionType, data) {
		
		this.DvaActions.Dispatch("UserCenterService", "GetQzwcResult", { data: {}, Action: this.GetAction(id, actionType) });
	}
	
	//保存实体数据
	ApplyEntityData(id, actionType, data) {
		console.log(data)
		this.DvaActions.Dispatch("UserCenterService", "ApplyQzwcResult", { data: data, Action: this.GetAction(id, actionType) });
	}
	
}