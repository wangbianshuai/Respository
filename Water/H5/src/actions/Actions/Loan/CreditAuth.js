import BaseIndex from "../../BaseIndex";
import { Common} from "UtilsCommon";

export default class CreditAuth extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "Loan_CreditAuth";
		this.MinActionType = 1700;
		this.MaxActionType = 1799;
		
		this.Init();
	}
	
	GetStateActionTypes() {
		const {QueryCreditAuthorize,creditAuthorize } = this.ActionTypes;
		
		return {
			EntityData: [QueryCreditAuthorize],
			SaveEntityData: [creditAuthorize]
		}
	}
	
	Invoke(id, actionType, data) {
		const { sendCreditAuthorizeSms, QueryCreditAuthorize,creditAuthorize } = this.ActionTypes;
		
		switch (actionType) {
			case QueryCreditAuthorize: this.QueryCreditAuthorize(id, actionType, data); break;
			case sendCreditAuthorizeSms: this.sendCreditAuthorizeSms(id, actionType, data); break;
			case creditAuthorize: this.OkConfirmCreditAuth(id, actionType, data); break;
			default: this.Dispatch(id, actionType, data); break;
		}
	}
	
	SetResponseData(id, actionType, data) {
		
	 	return this.SetApiResponse(data);
	}
	
	//获取实体数据
	QueryCreditAuthorize(id, actionType, data) {
		
		this.DvaActions.Dispatch("RiskControlApprovalService", 'QueryCreditAuthorize', { ...data, Action: this.GetAction(id, actionType) });
	}
	
	sendCreditAuthorizeSms(id, actionType, data) {
		
		this.DvaActions.Dispatch("RiskControlApprovalService", 'sendCreditAuthorizeSms', { ...data, Action: this.GetAction(id, actionType) });
	}
	
	//保存实体数据
	OkConfirmCreditAuth(id, actionType, data) {
		console.log(data);
		let msg = "";if (Common.IsNullOrEmpty(data.smsVerificationCode)) msg = "请输入验证码";
		if (msg) this.Dispatch(id, actionType, { IsSuccess: false, Message: msg });
		this.DvaActions.Dispatch("RiskControlApprovalService", 'creditAuthorize', { ...data, Action: this.GetAction(id, actionType) });
	}
	
	
	
}