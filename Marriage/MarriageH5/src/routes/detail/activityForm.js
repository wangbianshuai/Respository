import { EntityPageEdit } from "PageTemplates";
import { Common } from 'UtilsCommon';

export default EntityPageEdit("detail_activityForm", "Activity", '', 3200, {
    expandInit() {
        this.editView = this.getProperty("editView");
        this.resultView = this.getProperty('resultView');
        this.resultContent = this.getViewProperty(this.resultView, 'resultContent');
        this.fixedFields = {};
    },
    expandSetEntityData({ entityData, props, view }) {
        entityData.OpenID = this.pageData.openId;
        entityData.CompanyID = this.formConfig.companyID;
        entityData.EventUID = this.formConfig.eventUID;
        entityData.EventFormUID = this.formConfig.uid;

        const { fixedFields } = this;
        for (let key in fixedFields) {
            entityData[fixedFields[key]] = entityData[key];
        }
        return entityData;
    },
    saveEntityDataCallback() {
        if (!this.pageData.openId) Common.setStorage("formId_" + this.pageData.uid, this.pageData.uid);

        const { afterFormShowType, afterFormShowUrl, afterFormShowContent } = this.formConfig;
        if (afterFormShowType === 1) {
            if (!afterFormShowUrl) this.toPage('/detail/activity?tabPage=0&UID=' + this.pageData.activityUID)
            else window.location.href = afterFormShowUrl;
        }
        else {
            this.editView.setVisible(false);
            this.resultContent.value = afterFormShowContent || '提交成功';
            this.resultView.setVisible(true);
        }
    }
}, ['getFormConfig', 'getWxFanOpenId', 'judgeFollowPublicAccount']);