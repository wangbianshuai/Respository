import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("index", "MarriageUser", '连理缘-注册', 100, {
    expandInit() {
        this.getProperty('NickName').defaultValue = this.wxUser.nickname;
        this.getProperty('HeadImgUrl').defaultValue = this.wxUser.headimgurl;
        this.getProperty('Province').defaultValue = this.wxUser.province;
        this.getProperty('City').defaultValue = this.wxUser.city;

        this.idCardProperty = this.getProperty('IdCard');
        this.idCardProperty.valueChange = this.idCardValueChange.bind(this)
        this.birthdayProperty = this.getProperty('Birthday');
    },
    idCardValueChange(value) {
        if (!value || value.length < 14) return value;

        var year = value.substr(6, 4);
        var month = value.substr(10, 2);
        var day = value.substr(12, 2);

        var date = year + '-' + month + '-' + day;

        this.birthdayProperty.setValue(date);
    },
    saveEntityDataCallback() {
        this.alertSuccess('注册成功', () => {
            this.toPage('/mine/index');
        });
    }
}, ['ResourcesService/uploadFile']);