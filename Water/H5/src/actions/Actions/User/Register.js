import BaseIndex from "../../BaseIndex";
import { Common, Md5, Validate } from "UtilsCommon";

export default class Register extends BaseIndex {
    constructor(props) {
        super(props);

        this.Name = "User_Register";
        this.MinActionType = 100;
        this.MaxActionType = 199;

        this.Init();
    }

    GetStateActionTypes() {
        const { RegisterUser, CheckPhoneUnique, SendVerifyCode } = this.ActionTypes;

        return {
            RegisterUser: [RegisterUser],
            CompanyRegister: [RegisterUser],
            CheckPhoneUnique: [CheckPhoneUnique],
            SendTextVerifyCode: [SendVerifyCode],
            SendVoiceVerifyCode: [SendVerifyCode]
        }
    }

    Invoke(id, actionType, data) {
        const { RegisterUser, CheckPhoneUnique, SendVerifyCode } = this.ActionTypes;

        switch (actionType) {
            case RegisterUser: this.RegisterUser(id, actionType, data); break;
            case CheckPhoneUnique: this.CheckPhoneUnique(id, actionType, data); break;
            case SendVerifyCode: this.SendVerifyCode(id, actionType, data); break;
            default: this.Dispatch(id, actionType, data); break;
        }
    }

    RegisterUser(id, actionType, data) {
        data = data.EntityData;
        let msg = "";
        //企业用户
        // const isCompany = Common.IsEquals(data.UserType, 3);
		msg = this.ValidateCompanyName(data.CompanyName);
        if (!msg) msg = this.ValidatePhone(data.Phone);
        if (!msg) msg = this.ValidateVerifyCode(data.VerifyCode, false);
        if (!msg) msg = this.ValidatePassword(data.Password);
        if (!msg && !data.Agreement) msg = "注册前需同意《新新贷注册协议》、《资金出借风险提示函》";

        if (msg) this.Dispatch(id, actionType, { IsSuccess: false, Message: msg });
        else{
			const submitData = {
				enterpriseName: data.CompanyName,
				phone: data.Phone,
				messageCode: data.VerifyCode,
				password: Md5(Md5(data.Password)),
				userType: data.UserType,
				userAttr: 2
			};
	
			this.DvaActions.Dispatch("UserCenterService", "EdtRegister", { data: submitData, Action: this.GetAction(id, actionType) });
		}
        // else if (isCompany) {
        //     const submitData = {
        //         enterpriseName: data.CompanyName,
        //         phone: data.Phone,
        //         messageCode: data.VerifyCode,
        //         password: Md5(Md5(data.Password)),
        //         userAttr: 2
        //     };
		//
        //     this.DvaActions.Dispatch("UserCenterService", "CompanyRegister", { data: submitData, Action: this.GetAction(id, actionType) });
        // }
        // else {
        //     const formData = {
        //         phone: data.Phone,
        //         smsCode: data.VerifyCode,
        //         password: Md5(Md5(data.Password)),
        //         channel: "MbUVFf"
        //     };
		//
        //     this.DvaActions.Dispatch("ApiH5Service", "RegisterUser", { PathQuery: "?userAttr=2", FormData: formData, Action: this.GetAction(id, actionType) });
        // }
    }

    CheckPhoneUnique(id, actionType, data) {
        let msg = this.ValidatePhone(data.Phone);
		
        if (msg) this.Dispatch(id, actionType, { IsSuccess: false, Message: msg });
        else this.DvaActions.Dispatch("ApiH5Service", "CheckPhoneUnique", { PathQuery: `?username=${data.Phone}`, Action: this.GetAction(id, actionType) });
    }
	
	SetResponseData(id,actionType, data) {
		return this.SetApiResponse(data);
	}

    ValidateCompanyName(companyName) {
        let msg = "";

        if (Common.IsNullOrEmpty(companyName)) msg = "请输入公司全称";

        if (!msg) {
            let res = Validate.ValidateCompanyName(companyName);
            if (res !== true) msg = res;
        }

        return msg;
    }

    ValidatePhone(phone) {
        let msg = "";

        if (Common.IsNullOrEmpty(phone)) msg = "请输入您的手机号";

        if (!msg) {
            let res = Validate.ValidateMobile(phone);
            if (res !== true) msg = res;
        }

        return msg;
    }

    ValidatePassword(password) {
        let msg = "";

        if (Common.IsNullOrEmpty(password)) msg = "请设置登录密码";

        if (!msg) {
            let res = Validate.ValidatePassword(password);
            if (res !== true) msg = res;
        }

        return msg;
    }

    ValidateVerifyCode(verifyCode, blImage) {
        let msg = "";

        if (Common.IsNullOrEmpty(verifyCode)) msg = blImage ? "请输入图片验证码" : "请输入验证码";

        if (!msg && verifyCode.length < 4) msg = blImage ? "您的图片验证码不正确" : "您的验证码不正确";

        return msg;
    }

    SendVerifyCode(id, actionType, data) {
        const { ImageVerifyCode, SendType, Phone } = data.EntityData;

        let msg = this.ValidateVerifyCode(ImageVerifyCode, true);

        if (msg) this.Dispatch(id, actionType, { IsSuccess: false, Message: msg });
        else {
            const actionName = SendType === "sms" ? "SendTextVerifyCode" : "SendVoiceVerifyCode"
            const formData = { imgcode: ImageVerifyCode, phone: Phone };
            if (SendType === "sms") formData.type = "0"
            else formData.busiCode = "BUSICODE_REGISTER";

            this.DvaActions.Dispatch("ApiH5Service", actionName, { FormData: formData, Action: this.GetAction(id, actionType) });
        }
    }
}