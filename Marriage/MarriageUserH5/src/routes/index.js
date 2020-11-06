import { EntityPageEdit } from "PageTemplates";
import { LunarDate, Common } from 'UtilsCommon';
import { EnvConfig } from 'Configs';

export default EntityPageEdit("index", "MarriageUser", '连理缘-注册', 100, {
    expandInit() {
        if (this.loginUser) return;
        this.getProperty('NickName').defaultValue = this.wxUser.nickname;
        this.getProperty('HeadImgUrl').defaultValue = this.wxUser.headimgurl;
        this.getProperty('Province').defaultValue = this.wxUser.province;
        this.getProperty('City').defaultValue = this.wxUser.city;

        this.idCardProperty = this.getProperty('IdCard');
        this.idCardProperty.valueChange = this.idCardValueChange.bind(this);
        this.birthdayProperty = this.getProperty('Birthday');
        this.birthdayProperty.valueChange = this.birthdayValueChange.bind(this);
        this.birthTimeProperty = this.getProperty("BirthTime");
        this.birthTimeProperty.valueChange = this.birthTimeValueChange.bind(this);

        this.lunarBirthdayProperty = this.getProperty('LunarBirthday');
        this.birthEightProperty = this.getProperty('BirthEight');
    },
    componentDidmount() {
        if (this.loginUser) {
            this.toPage('marriage/index');
            return;
        }
    },
    expandSetEntityData({ entityData, props, view }) {
        entityData.OpenId = this.wxUser.openid;
        if (this.pageData.matchmakerId) entityData.MatchmakerId = this.pageData.matchmakerId

        return entityData;
    },
    birthdayValueChange(value) {
        this.setLunarDate(value, this.birthTimeProperty.getValue());
    },
    birthTimeValueChange(value) {
        this.setLunarDate(this.birthdayProperty.getValue(), value);
    },
    setLunarDate(birthday, birthTime) {
        const date = Common.convertToDate(birthday, "yyyy-MM-dd");
        if (!date || !(date instanceof Date) || Common.isNullOrEmpty(birthTime)) return;
        if (birthTime >= 0) {
            const [lunarDate, birthEight] = new LunarDate(date).getLunarDate(birthTime);

            this.lunarBirthdayProperty.setValue(lunarDate);
            this.birthEightProperty.setValue(birthEight);
        }
    },
    idCardValueChange(value) {
        if (!value || value.length < 14) return value;

        var year = value.substr(6, 4);
        var month = value.substr(10, 2);
        var day = value.substr(12, 2);

        var date = year + '-' + month + '-' + day;
        this.birthdayProperty.setValue(date);
    },
    saveEntityDataCallback({ data }) {
        const str = window.btoa(encodeURIComponent(JSON.stringify(data)));
        Common.setStorage(EnvConfig.loginUserKey, str);
        Common.setStorage(EnvConfig.loginUserIdKey, data.UserId);
        this.alertSuccess('注册成功', () => {
            this.toPage('/mine/index');
        });
    }
}, ['ResourcesService/uploadFile']);