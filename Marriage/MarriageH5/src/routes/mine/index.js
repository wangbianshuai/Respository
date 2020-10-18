import { EntityPageEdit } from "PageTemplates";
import { Common } from 'UtilsCommon';

export default EntityPageEdit("mine_index", "User", '账户信息', 2100, {
    judgeRequireLogin() {
        return !this.judgeLogin();
    },
    expandInit() {
        this.pageData.UID = this.loginUser.UID;

        if (this.loginUser.UserType !== 30) {
            this.upgradeAccountProperty = this.getProperty('upgradeAccount');
            this.upgradeAccountProperty.expandEntityDataLoad = this.upgradeAccountExpandEntityDataLoad.bind(this);
            this.labIDProperty = this.getViewProperty(this.upgradeAccountProperty, 'LabID');
            this.remarkProoperty = this.getViewProperty(this.upgradeAccountProperty, 'remark');
        }

        this.tabs1Property = this.getProperty('tabs1');

        if (this.loginUser.UserType === 30) {
            const personInfoProperty = this.getProperty("personInfo");

            const callNumberCodeProperty = this.getViewProperty(personInfoProperty, "CallNumberCode");
            callNumberCodeProperty.name = 'Phone';
            callNumberCodeProperty.isReadOnly = false;
            callNumberCodeProperty.style = null;

            const firstNameProperty = this.getViewProperty(personInfoProperty, "FirstName");
            firstNameProperty.label = "用户名";
            firstNameProperty.isReadOnly = true;
            firstNameProperty.isNullable = true;
            firstNameProperty.style = { color: '#999999' };
            const lastNameProperty = this.getViewProperty(personInfoProperty, "LastName");
            lastNameProperty.label = "联系人";

            const accountProperty = this.getViewProperty(personInfoProperty, "Account");
            accountProperty.isVisible = true;

            this.labUserManageProperty = this.getProperty('labUserManage');
            if (this.pageData.UserUID) {
                this.labUserManageProperty.properties = [this.labUserManageProperty.properties[1]];
                this.buttonViewProperty = this.getViewProperty(this.labUserManageProperty, 'buttonView');
            }
            else this.labUserManageProperty.properties = [this.labUserManageProperty.properties[0]];

            this.jobManageViewProperty = this.getProperty('jobManageView');
            if (this.pageData.JobUID || this.pageData.isAdd) {
                this.jobManageViewProperty.isDiv = false;
                this.jobManageViewProperty.properties = [this.jobManageViewProperty.properties[2]];
            }
            else this.jobManageViewProperty.properties = [this.jobManageViewProperty.properties[0], this.jobManageViewProperty.properties[1]];

            this.tabs1Property.properties = this.tabs1Property.properties.filter(f => f.name !== 'upgradeAccount' && f.name !== 'changeCellView');
        }
        else if (this.loginUser.UserType === 20) {
            this.tabs1Property.properties = this.tabs1Property.properties.filter(f => f.name !== 'labUserManage' && f.name !== 'partnerLab' && f.name !== 'jobManage');
        }
        else {
            this.tabs1Property.properties = this.tabs1Property.properties.filter(f => f.name !== 'instrumentManage' && f.name !== 'labUserManage' && f.name !== 'partnerLab' && f.name !== 'jobManage');
        }
    },
    setGetCollaborationInfoLoad({ data, props, action }) {
        if (!data.UID) {
            this.savePartnerLabProperty = this.getViewProperty(props.view, 'savePartnerLab');
            this.savePartnerLabProperty.confirmTip = null;
            this.imageProperty = this.getViewProperty(props.view, 'Image');
            this.imageProperty.isNullable = false;
        }
    },
    setGetLabUserLoad({ data, props, action }) {
        if (data.UserType !== 20) {
            this.buttonViewProperty.properties[0].isVisible = true;
        }
        this.buttonViewProperty.setVisible(true);
    },
    setGetEntityDataLoad({ data, props, action }) {
        Common.setStorage("loginUserInfo", JSON.stringify(data));
    },
    upgradeAccountExpandEntityDataLoad() {
        const { entityData } = this.upgradeAccountProperty;
        if (entityData.LabID) {
            const remark = entityData.UserRoleSign ? '您已成功升级为User帐户' : '您的申请已发出，请耐心等待审核通过。';
            this.setPropertyValue(this.remarkProoperty, remark)

            if (entityData.UserRoleSign) this.setPropertiesVisiable(this.upgradeAccountProperty.properties, ['remark', 'LabID', 'ApproveUserDate', 'quitUserAccount2']);
            else this.setPropertiesVisiable(this.upgradeAccountProperty.properties, ['remark', 'LabID', 'quitUserAccount']);
        }
        else this.setPropertiesVisiable(this.upgradeAccountProperty.properties, ['upgradeRemark', 'LabAccount', 'applyUserAccount']);
    },
    setPropertiesVisiable(properties, names) {
        properties.forEach(p => {
            const isVisible = names.includes(p.name)
            p.isVisible = isVisible;
            if (p.setVisible) p.setVisible(isVisible);
        })
    },
    setPropertyValue(p, v) {
        p.value = v;
        if (p.setValue) p.setValue(v);
    },
    applyUserAccountCallback({ data, props, action }) {
        this.alertSuccess('申请成功');
        const formData = {
            Param: '{}',
            Act: 'User_GetInfo'
        }

        this.dispatchAction('UserService', "getInfo", { formData }).then(res => {
            if (!this.isSuccessProps(res)) return;

            this.upgradeAccountProperty.entityData.LabUID = res.LabUID;
            this.setPropertyValue(this.labIDProperty, this.upgradeAccountProperty.entityData.LabAccount)
            this.setPropertyValue(this.remarkProoperty, '您的申请已发出，请耐心等待审核通过。');

            this.setPropertiesVisiable(this.upgradeAccountProperty.properties, ['remark', 'LabID', 'quitUserAccount']);
        });
    },
    quitUserAccountCallback({ data, props, action }) {
        this.alertSuccess('退出成功', () => {
            let url = Common.addUrlRandom("/mine/index");
            this.toPage(url);
        });
    },
    changeCellSuccess({ data, props, action }) {
        this.alertSuccess('更换手机成功!', () => {
            let url = Common.addUrlRandom("/mine/index");
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
    },
    passLabUserApplyCallback({ data, props, action }) {
        this.alertSuccess('通过成功', () => {
            this.buttonViewProperty.properties[0].setVisible(false);
        });
    },
    rejectLabUserApplyCallback({ data, props, action }) {
        this.alertSuccess('驳回成功', () => {
            this.toPage('/mine/index?tabPage=2');
        });
    },
    savePartnerLabCallback({ data, props, action }) {
        this.alertSuccess('保存成功', () => {
            this.toPage(Common.addUrlRandom('/mine/index?tabPage=3'));
        });
    },
    saveJobCallback({ data, props, action }) {
        this.alertSuccess('保存成功', () => {
            this.toPage(Common.addUrlRandom('/mine/index?tabPage=4'));
        });
    },
}, ['applyUserAccount', 'quitUserAccount', 'changePassword', 'sendSms', 'changeCell', 'getFavorites', 'getLabUser',
    'passLabUserApply', 'rejectLabUserApply', 'getCollaborationInfo', 'savePartnerLab', 'searchJob', 'getJob', 'saveJob',
    'getCountryCodeList', 'getRandomUID', 'verifyCallNumberCode', 'getInfo', 'getLabProductList', 'getSingleSysSettingInfo',
    'getRecommendActivities', 'getLabUsers',
    'getCountryProvinceCityList', 'LibraryService/getApplications', 'LibraryService/getTechniques', 'uploadHeadImage']);