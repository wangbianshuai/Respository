const { getRadio, getTextBox, getSelect2, getButton, regExpress } = require('../../common');

//user/login 1600-1699
const dataActionTypes = {
    //get entity data
    getEntityData: 1600,
    //Save entity data
    saveEntityData: 1601,
    //send sms
    sendSms: 1602,
    //login
    login: 1603
};

const entity = { name: 'User', primaryKey: 'UID' };

module.exports = {
    name: "login",
    type: "View",
    eventActions: getEventActions(),
    properties: getProperties()
}

function getProperties() {
    return [
        getCarousel(),
        { name: 'whiteSpace30', type: 'WhiteSpace', className: 'whiteSpace30' },
        getEditView(),
        { name: 'forgotPassword', text: '忘记密码', type: 'LinkText', url: '/user/forgotPassword', isAddUrl: true, isDiv: true, className: "divLink" },
        { name: 'register', text: '没有账号，现在就去注册', type: 'LinkText', url: '/user/register', isAddUrl: true, isDiv: true, className: "divLink" },
    ]
}

function getEditView() {
    return {
        name: 'editView',
        type: 'RowsColsView',
        entity,
        isList: true,
        className: 'divLogin',
        properties: getEditProperties()
    }
}

function getEditProperties() {
    return [{
        ...getRadio('loginType', '', getLoginTypeDataSource(), 1, 1, 1), rowClassName: "divRow2", isListItem: true, isEdit: true,
        valueVisibleProperties: { 1: ['CountryCode', 'CallNumber', 'CallNumberValidCode'], 2: ['CountryCode', 'CallNumber', 'Pwd'], 3: ['AccountEmail', 'Pwd'] }
    },
    { ...getSelect2('CountryCode', '地区', getPhoneCodeAreaDataSource(), 2, 1, '86'), rowClassName: "divRow2", isEdit: true, listName: 'List' },
    { ...getTextBox('CallNumber', '手机', '', 3, 1, '请输入手机', 11), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false, regExp: regExpress.noNumber },
    { ...getTextBox('AccountEmail', '账号', '', 4, 1, '请输入账号', 50), isEdit: true, rowClassName: "divRow2", clear: true, isVisible: false, isNullable: false },
    { ...getTextBox('Pwd', '密码', 'password', 5, 1, '请输入密码', 50), isEdit: true, rowClassName: "divRow2", clear: true, isVisible: false, isNullable: false },
    {
        ...getTextBox('ValidationCode', '图形验证码', '', 6, 1, '请输入图形验证码', 6), isEdit: true,
        type: 'ImageVerifyCode', rowClassName: "divRow2", isNullable: false, propertyName2: 'ValidationCodeUID'
    },
    {
        ...getTextBox('CallNumberValidCode', '短信验证码', '', 7, 1, '请输入短信验证码', 6), isEdit: true,
        saveEntityDataActionType: dataActionTypes.sendSms, regExp: regExpress.noNumber,
        type: 'SendVerifyCode', rowClassName: "divRow2", sendSmsEventActionName: 'sendSms', isNullable: true
    },
    { ...getButton('login', '登录', 'primary', 8, 1), saveEntityDataActionType: dataActionTypes.login, className: 'loginButton', eventActionName: 'login', rowClassName: "divRow3" }]
}

function getPhoneCodeAreaDataSource() {
    return {
        stateName: "getCountryCodeList",
        serviceName: "UserService",
        actionName: "getCountryCodeList",
        valueName: 'CountryCode',
        textName: 'CountryNameCn',
        payload: {
            formData: {
                Param: '{}',
                Act: 'Other_GetCountryCodeList'
            }
        }
    }
}

function getLoginTypeDataSource() {
    return [{ value: 1, text: '手机(验证码)' }, { value: 2, text: '手机' }, { value: 3, text: ' 帐户' }]
}

function getCarousel() {
    return {
        name: 'bannerList',
        type: 'Carousel',
        hrefName: 'LinkHref',
        listName: 'List',
        imageUrlName: 'BannerImg',
        isImageLink: true,
        className: 'divImage',
        autoplay: true,
        infinite: true,
        serviceDataSource: getBannerListDataSource()
    }
}

function getBannerListDataSource() {
    return {
        stateName: "getBannersList",
        serviceName: "UserService",
        actionName: "getBannersList",
        payload: {
            formData: {
                Param: '{ BannerType: 0 }',
                Act: 'Banners_GetList'
            }
        }
    }
}

function getEventActions() {
    return [{
        name: "sendSms",
        type: "entityEdit/saveEntityData",
        editView: "editView",
        successCallback: "sendSmsSuccess",
        failedCallback: "sendSmsFailed"
    },
    {
        name: "login",
        type: "entityEdit/saveEntityData",
        editView: "editView",
        successCallback: "loginSuccess",
        failedCallback: "sendSmsFailed"
    }]
}
