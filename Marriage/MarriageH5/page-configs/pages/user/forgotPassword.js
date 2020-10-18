const { getRadio, getTextBox, getSelect2, getButton, regExpress } = require('../../common');

//user/forgotPassword 1900-1999
const dataActionTypes = {
  //get entity data
  getEntityData: 1900,
  //Save entity data
  saveEntityData: 1901,
  //send sms
  sendSms: 1902,
  //forgotPassword
  forgotPassword: 1903
};

const entity = { name: 'User', primaryKey: 'UID' };

module.exports = {
  name: "forgotPassword",
  type: "View",
  eventActions: getEventActions(),
  properties: getProperties()
}

function getProperties() {
  return [
    getCarousel(),
    { name: 'whiteSpace30', type: 'WhiteSpace', className: 'whiteSpace30' },
    getEditView()
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
  return [
    { ...getSelect2('CountryCode', '地区', getPhoneCodeAreaDataSource(), 1, 1, '86'), rowClassName: "divRow2", isEdit: true, listName: 'List' },
    { ...getTextBox('CallNumber', '手机', '', 2, 1, '请输入手机', 11), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false, regExp: regExpress.noNumber },
    { ...getTextBox('NewPass', '新密码', 'password', 3, 1, '请输入密码', 50), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false },
    { ...getTextBox('AgainPwd', '确认密码', 'password', 4, 1, '请输入密码', 50), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false },
    {
      ...getTextBox('ValidationCode', '图形验证码', '', 5, 1, '请输入图形验证码', 6), isEdit: true,
      type: 'ImageVerifyCode', rowClassName: "divRow2", isNullable: false, propertyName2: 'ValidationCodeUID'
    },
    {
      ...getTextBox('CallNumberValidCode', '短信验证码', '', 6, 1, '请输入短信验证码', 6), isEdit: true,
      saveEntityDataActionType: dataActionTypes.sendSms, regExp: regExpress.noNumber,
      type: 'SendVerifyCode', rowClassName: "divRow2", sendSmsEventActionName: 'sendSms', isNullable: true
    },
    { ...getButton('forgotPassword', '重置密码', 'primary', 7, 1), saveEntityDataActionType: dataActionTypes.forgotPassword, className: 'loginButton', eventActionName: 'forgotPassword', rowClassName: "divRow3" }]
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
    failedCallback: "sendSmsFailed",
    expandSetEntityData: 'expandSetEntityData'
  },
  {
    name: "forgotPassword",
    type: "entityEdit/saveEntityData",
    editView: "editView",
    successCallback: "forgotPasswordSuccess",
    failedCallback: "sendSmsFailed",
    expandSetEntityData: 'expandSetEntityData'
  }]
}
