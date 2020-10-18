import { Common, Validate } from "UtilsCommon";

export default {
  forgotPassword(id, actionType, data) {
    const { ValidationCodeUID, ValidationCode, CallNumber, CountryCode, CallNumberValidCode, NewPass } = data.entityData;

    if (CallNumber && CountryCode === "86") {
      let res = Validate.validateMobile(CallNumber);
      if (res !== true) {
        this.dispatch(id, actionType, { isSuccess: false, message: res });
        return;
      }
    }

    if (Common.isNullOrEmpty(CallNumberValidCode)) {
      this.dispatch(id, actionType, { isSuccess: false, message: '请输入短信验证码' });
      return;
    }

    const formData = {
      Param: JSON.stringify({ ValidationCodeUID, ValidationCode, CallNumber, CountryCode, CallNumberValidCode }),
      Act: 'User_VerifyCallNumberCode'
    };

    const action = this.getAction(id, actionType);
    action.NewPass = NewPass;

    this.dvaActions.dispatch("UserService", 'verifyCallNumberCode', { action, formData });
  },
  setforgotPassword(id, actionType, data) {
    if (!this.receives[id]) return false;

    const NewPass = data.action ? data.action.NewPass : null;

    data = this.setApiResponse(data);

    if (data.isSuccess === false) return data;

    const { CountryCode, CallNumber, CallNumberToken } = data;

    const formData = {
      Param: JSON.stringify({ NewPass, CallNumber, CountryCode, CallNumberToken }),
      Act: 'User_ResetPassword'
    };

    this.dvaActions.dispatch("UserService", "forgotPassword", { action: this.getAction(id, this.actionTypes.verifyCallNumberCode), formData });
    return false
  },
  setverifyCallNumberCode(id, actionType, data) {
    if (!this.receives[id]) return false;

    data = this.setApiResponse(data);

    this.dispatchToReceive(id, this.actionTypes.forgotPassword, data);
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