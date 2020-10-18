import { Common } from 'UtilsCommon';
import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("user_login", "User", '登录', 1600, {
    componentDidmount() {
        this.setActionState("UserService", "login");
    },
    loginSuccess({ data, props, action }) {
        Common.setStorage("loginUserInfo", JSON.stringify(data));
        Common.setStorage("loginUserId", data.UID);
        Common.setStorage("token", data.Token, 120);

        let url = "/mine/index";
        if (this.pageData.url) url = this.pageData.url;
        this.toPage(url);

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
}, ['sendSms', 'login', 'getCountryCodeList', 'getRandomUID', 'verifyCallNumberCode']);