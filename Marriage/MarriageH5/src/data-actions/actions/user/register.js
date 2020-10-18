import { Common, Validate } from "UtilsCommon";

export default {
  register(id, actionType, data) {
    const { ValidationCodeUID, ValidationCode, CallNumber, CountryCode, CallNumberValidCode, Pwd, AgainPwd, Email, FirstName, LastName } = data.entityData;

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

    if (Common.isNullOrEmpty(FirstName)) {
      this.dispatch(id, actionType, { isSuccess: false, message: '名称不能为空' });
      return;
    }

    if (Common.isNullOrEmpty(LastName)) {
      this.dispatch(id, actionType, { isSuccess: false, message: '姓氏不能为空' });
      return;
    }

    if (Common.isNullOrEmpty(Email)) {
      this.dispatch(id, actionType, { isSuccess: false, message: '邮箱不能为空' });
      return;
    }
    else {
      let res = Validate.validateEmail(Email);
      if (res !== true) {
          this.dispatch(id, actionType, { isSuccess: false, message: res });
          return;
      }
    }

    if (Pwd !== AgainPwd) {
      this.dispatch(id, actionType, { isSuccess: false, message: '两次密码输入不一致' });
      return;
    }

    const formData = {
      Param: JSON.stringify({ ValidationCodeUID, ValidationCode, CallNumber, CountryCode, CallNumberValidCode }),
      Act: 'User_VerifyCallNumberCode'
    };

    const action = this.getAction(id, actionType);
    action.entityData = data.entityData;

    this.dvaActions.dispatch("UserService", 'verifyCallNumberCode', { action, formData });
  },
  setverifyCallNumberCode(id, actionType, data) {
    if (!this.receives[id]) return false;

    data = this.setApiResponse(data);

    this.dispatchToReceive(id, this.actionTypes.register, data);
    return false;
  },
  setregister(id, action, data) {
    if (!this.receives[id]) return false;

    const entityData = data.action ? data.action.entityData : null;

    data = this.setApiResponse(data);

    if (data.isSuccess === false) return data;

    const { Pwd, Email, FirstName, LastName } = entityData;
    const { CountryCode, CallNumber, CallNumberToken } = data;

    const formData = {
      Param: JSON.stringify({
        Pwd, Email, FirstName, LastName,
        CountryCode, CallNumber, CallNumberToken
      }),
      Act: 'User_Reg'
    };

    this.dvaActions.dispatch("UserService", 'register', { action: this.getAction(id, this.actionTypes.verifyCallNumberCode), formData });
    return false
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
      Param: JSON.stringify({ ValidationCodeUID, ValidationCode, CallNumber, CountryCode, CallNumberUsed: false }),
      Act: 'User_SendCallNumberCode'
    };
    this.dvaActions.dispatch("UserService", "sendSms", { action: this.getAction(id, actionType), formData });
  },
}