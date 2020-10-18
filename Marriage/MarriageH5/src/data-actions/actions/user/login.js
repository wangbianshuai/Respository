import { Common, Validate } from "UtilsCommon";

export default {
    login(id, actionType, data) {
        const { loginType, ValidationCodeUID, ValidationCode, CallNumber, CountryCode, CallNumberValidCode, Pwd, AccountEmail } = data.entityData;
        const OpenID = data.pageData.openId;

        if (CallNumber && CountryCode === "86") {
            let res = Validate.validateMobile(CallNumber);
            if (res !== true) {
                this.dispatch(id, actionType, { isSuccess: false, message: res });
                return;
            }
        }

        let formData = null;

        let actionName = 'login';
        if (loginType === 1) {
            if (Common.isNullOrEmpty(CallNumberValidCode)) {
                this.dispatch(id, actionType, { isSuccess: false, message: '请输入短信验证码' });
                return;
            }

            formData = {
                Param: JSON.stringify({ ValidationCodeUID, ValidationCode, CallNumber, CountryCode, CallNumberValidCode }),
                Act: 'User_VerifyCallNumberCode'
            };
            actionName = 'verifyCallNumberCode'
        }
        else if (loginType == 2) {
            formData = {
                Param: JSON.stringify({ AccountEmail: "", OpenID, Pwd, ValidationCodeUID, ValidationCode, LoginWay: false, LoginCellEmailPass: true, CallNumber, CountryCode }),
                Act: 'User_LoginByH5'
            };
        }
        else {
            formData = {
                Param: JSON.stringify({ AccountEmail, Pwd, OpenID, ValidationCodeUID, ValidationCode, LoginWay: false, LoginCellEmailPass: false, CallNumber: '', CountryCode: '86' }),
                Act: 'User_LoginByH5'
            }
        }

        const action = this.getAction(id, actionType);
        action.loginType = loginType;
        action.openId= OpenID;

        this.dvaActions.dispatch("UserService", actionName, { action, formData });
    },
    setlogin(id, actionType, data) {
        if (!this.receives[id]) return false;

        const loginType = data.action ? data.action.loginType : 0;
        const OpenID = data.action ? data.action.openId : '';

        data = this.setApiResponse(data);

        if (data.isSuccess === false || loginType !== 1) return data;

        const { CountryCode, CallNumber, CallNumberToken } = data;

        const formData = {
            Param: JSON.stringify({ "AccountEmail": "", OpenID, "Pwd": "", "ValidationCodeUID": "", "ValidationCode": "", LoginWay: true, LoginCellEmailPass: true, CallNumber, CountryCode, CallNumberToken }),
            Act: 'User_LoginByH5'
        };

        this.dvaActions.dispatch("UserService", "login", { action: this.getAction(id, this.actionTypes.verifyCallNumberCode), formData });
        return false
    },
    setverifyCallNumberCode(id, actionType, data) {
        if (!this.receives[id]) return false;

        data = this.setApiResponse(data);

        this.dispatchToReceive(id, this.actionTypes.login, data);
        return false;
    },
    sendSms(id, actionType, data) {
        const { ValidationCodeUID, ValidationCode, CallNumber, CountryCode } = data.entityData;

        if (CallNumber && CountryCode === "86") {
            let res = Validate.validateMobile(CallNumber);
            if (res !== true) {
                this.dispatch(id, actionType, { isSuccess: false, message: res });
                return;
            }
        }

        const formData = {
            Param: JSON.stringify({ ValidationCodeUID, ValidationCode, CallNumber, CountryCode, CallNumberUsed: true }),
            Act: 'User_SendCallNumberCode'
        };
        this.dvaActions.dispatch("UserService", "sendSms", { action: this.getAction(id, actionType), formData });
    },
}