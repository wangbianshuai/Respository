import BaseIndex from "../../BaseIndex";
import { Common, Validate } from "UtilsCommon";

export default class OpenAccount extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "User_OpenAccount";
        this.MinActionType = 1100;
        this.MaxActionType = 1199;

        this.Init();
    }
	
	GetStateActionTypes() {
		const { UserRealName, GetUserAccount, GetFuyouJump } = this.ActionTypes;
		
		return {
			UserRealName: [UserRealName],
			UserAccount: [GetUserAccount],
			FuyouJump: [GetFuyouJump]
		}
	}
	
	Invoke(id, actionType, data) {
		const {UserInfo, UserRealName, GetUserAccount,GetFuyouJump } = this.ActionTypes;
		
		switch (actionType) {
			case UserRealName: this.UserRealName(id, actionType, data); break;
			case UserInfo: this.getUserInfo(id, actionType, data); break;
			case GetUserAccount: this.GetUserAccount(id, actionType, data); break;
			case GetFuyouJump: this.GetFuyouJump(id, actionType, data); break;
			default: break;
		}
	}
	
	UserRealName(id, actionType, data) {
    	// console.log(data)
		let msg = this.ValidateName(data.realName);
		
		if (!msg) msg = this.ValidateIdNumber(data.idCardNumber);
		if (!data.Agreement) msg = "开户前需同意《用户授权协议》";
		
		if (msg) this.Dispatch(id, actionType, { IsSuccess: false, Message: msg });
		else {
			//先实名认证，通过之后再GetFuyouJump，再跳转富友
			//1.实名认证
			const formData = {
				realName: data.realName,
				idCardNumber: data.idCardNumber,
				cardType:'2'
			};
			this.DvaActions.Dispatch("ApiH5Service", "UserRealName", { FormData: formData, Action: this.GetAction(id, actionType) });
		}
	}
	
	//用户是否实名认证
	getUserInfo(id, actionType, data){
		this.DvaActions.Dispatch("ApiH5Service", "UserInfo", { Action: this.GetAction(id, actionType) });
	}
	
	//用户已开户获取用户信息
	GetUserAccount(id, actionType, data) {
		this.DvaActions.Dispatch("ApiH5Service", "GetUserAccount", { Action: this.GetAction(id, actionType) });
	}
	
	
	GetFuyouJump(id, actionType, data){
		//2.获取跳转富友参数
		const url = "accounts/fuyou?userAttr=2";
		const { GetFuyouJump } = this.ActionTypes;
		this.DvaActions.Dispatch("ApiH5Service", "GetFuyouJump", { Url: url, Action: this.GetAction(id, GetFuyouJump) });
	}
	
	SetResponseData(id,actionType, data) {
		const {GetFuyouJump } = this.ActionTypes;
		
		switch (actionType) {
			case GetFuyouJump: return this.SetGetFuyouJump(data);
			default: return this.SetApiResponse(data);
		}
	}
	
	
	SetGetFuyouJump(data) {
		//3.最后一步跳转去富友
		// const id = data.Action.Id;
		
		if (data.Data) data = data.Data;
		// console.log(data)
		if (data.code) {
			data = { IsSuccess: false, Message: data.message };
			return data;
		}
		data.fuiou_open_capital_account_page_url && Common.SumbitForm(data.fuiou_open_capital_account_page_url, data.fuiouParams)
		//
		return false;
	}
	
	

    ValidateName(value) {
        let msg = "";

        if (Common.IsNullOrEmpty(value)) msg = "请输入真实姓名";

        return msg;
    }

    ValidateIdNumber(value) {

        let msg = "";

        if (Common.IsNullOrEmpty(value)) msg = "请输入身份证号码";

        if (!msg) {
            let res = Validate.ValidateIdentityCard(value);
            if (res !== true) msg = res;
        }

        return msg;
    }

}

