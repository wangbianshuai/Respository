import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("user_register", "User", '注册', 2000, {
  registerSuccess({ data, props, action }) {
    this.alertSuccess('注册成功!', () => {
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
}, ['sendSms', 'verifyCallNumberCode', 'register', 'getCountryCodeList', 'getRandomUID']);