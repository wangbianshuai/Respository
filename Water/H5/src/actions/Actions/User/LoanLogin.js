import BaseIndex from "../../BaseIndex";
import {Common} from "UtilsCommon";

export default class LoanLogin extends BaseIndex {
	constructor(props) {
		super(props);
		
		this.Name = "User_LoanLogin";
		this.MinActionType = 1900;
		this.MaxActionType = 1999;
		
		this.Init();
	}
	
	Invoke(id, actionType, data) {
		const {Login} = this.ActionTypes;
		switch (actionType) {
			case Login:
				this.Login(id, actionType, data);
				break;
			default:
				this.Dispatch(id, actionType, data);
				break;
		}
	}
	
	SetResponseData(id, actionType, data) {
		const {Login, GetData, GetRoles} = this.ActionTypes;
		
		switch (actionType) {
			case Login:
				return this.SetLogin(id, actionType, data);
			case GetData:
				return this.SetGetData(id, actionType, data);
			case GetRoles:
				return this.SetGetRoles(id, actionType, data);
			default:
				return this.SetApiResponse(data);
		}
	}
	
	Login(id, actionType, data) {
		
		let msg = this.JudgeNullable(data, {
			UserName: "请输入用户名",
			Password: "请输入登录密码",
		});
		
		if (msg) this.Dispatch(id, actionType, {IsSuccess: false, Message: msg, JudgeNullable:true});
		else {
			const params = {
				username: data.UserName,
				password: data.Password,
				rememberMe: true
			};
			this.DvaActions.Dispatch("AuthService", "LoanLogin", {...params, Action: this.GetAction(id, actionType)});
		}
	}
	
	SetLogin(id, actionType, data) {
		if (!this.Receives[id]) return false;
		
		data = this.SetApiResponse(data);
		
		if (data.IsSuccess === false || !data.access_token) {
			if (data.JudgeNullable) return data;
			else return {IsSuccess: false, Message: "登录名或密码错误！"}
		}
		else {
			// return data;
			Common.SetStorage("LoanUserCode",'');
			Common.SetStorage("LoanUserCode", data.usercode);

			Common.SetCookie("LoanLoginData", JSON.stringify(data));

			const payload = { Action: this.GetAction(id, this.ActionTypes.GetData) };
			payload.Token = data.access_token;
			
			this.DvaActions.Dispatch("UserService", "GetData", payload);

			return false
		}
	}
	
	
	SetGetData(id, actionType, data) {
		if (!this.Receives[id]) return false;
		
		data = this.SetApiResponse(data);
		
		if (data.IsSuccess === false || !data.userId) {
			Common.SetStorage("LoanUserCode",'');
			Common.RemoveCookie("LoanLoginData");
			
			data = { IsSuccess: false, Message: "登录用户未授权！" }
			
			return data
		}else{
			
			const rolesData = { queryUserId:data.userId };
			
			this.DvaActions.Dispatch("UserService", "GetRoles", {...rolesData, Action: this.GetAction(id, this.ActionTypes.GetRoles)});
			
			return false;
		}
	}
	
	SetGetRoles(id, actionType, data){
		data = this.SetApiResponse(data);
		
		if (data.IsSuccess === false) {
			Common.SetStorage("LoanUserCode",'');
			Common.RemoveCookie("LoanLoginData");
			
			data = { IsSuccess: false, Message: "登录用户没有信贷员权限！" }
		}
		
		return data;
	}
	
}