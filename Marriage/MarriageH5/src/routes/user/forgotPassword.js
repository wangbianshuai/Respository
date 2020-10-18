import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("user_forgotPassword", "User", '重置密码', 1900, {
  expandSetEntityData({ entityData, props, view }) {
    const { NewPass, AgainPwd } = entityData;
    if (NewPass !== AgainPwd) {
      this.alert('两次密码输入不一致');
      return false;
    }
    return entityData;
  },
  forgotPasswordSuccess({ data, props, action }) {
    this.alertSuccess('重置密码成功!', () => {
      let url = "/user/login";
      if (this.pageData.url) url = this.pageData.url;
      this.toPage(url);
    });
  },
  sendSmsSuccess({ data, props, action }) {
    this.alertSuccess('短信已发出！')
    const { property } = props;
    property.showSecondCount();
  },
  sendSmsFailed({ data, props, action }) {
    if (!this.validationCodeProperty) {
      const { editView } = action.parameters;

      this.validationCodeProperty = this.getViewProperty(editView, 'ValidationCode');
    }

    this.validationCodeProperty.refreshVerifyUrl();
  }
}, ['sendSms', 'forgotPassword', 'getCountryCodeList', 'getRandomUID', 'verifyCallNumberCode']);