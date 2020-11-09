import { EntityPageEdit } from "PageTemplates";

export default EntityPageEdit("index", "Matchmaker", '连理缘-红娘-注册', 100, {
    expandInit() {
        this.getProperty('NickName').defaultValue = this.wxUser.nickname;
        this.getProperty('HeadImgUrl').defaultValue = this.wxUser.headimgurl;
        this.getProperty('Province').defaultValue = this.wxUser.province;
        this.getProperty('City').defaultValue = this.wxUser.city;
    },
    hasTokenCallback() {
        this.toPage('boygirl/index');
    },
    expandSetEntityData({ entityData, props, view }) {
        entityData.OpenId = this.wxUser.openid;
        return entityData;
    },
    saveEntityDataCallback() {
        this.alertSuccess('注册成功', () => {
            this.toPage('/mine/index');
        });
    }
}, ['ResourcesService/uploadFile']);