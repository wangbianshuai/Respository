const { getSpanText, getTextBox, getSelect2, getButton, regExpress } = require('../../common');

//user/register 2000-2099
const dataActionTypes = {
  //get entity data
  getEntityData: 2000,
  //Save entity data
  saveEntityData: 2001,
  //send sms
  sendSms: 2002,
  //verifyCallNumberCode
  verifyCallNumberCode: 2003,
  //register
  register: 2004
};

const entity = { name: 'User', primaryKey: 'UID' };

module.exports = {
  name: "register",
  type: "View",
  eventActions: getEventActions(),
  properties: getProperties()
}

function getProperties() {
  return [
    getCarousel(),
    { name: 'whiteSpace30', type: 'WhiteSpace', className: 'whiteSpace30' },
    getEditView(),
    { name: 'whiteSpace30', type: 'WhiteSpace', className: 'whiteSpace30' }
  ]
}

function getRegisterView() {
  return {
    name: 'registerView',
    type: 'RowsColsView',
    isVisible: false,
    entity,
    isList: true,
    className: 'divLogin',
    properties: getRegisterProperties()
  }
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
    { ...getTextBox('CallNumber', '手机', '', 2, 1, '请输入手机', 11), isEdit: true, rowClassName: "divRow2", clear: true, isRed: true, isNullable: false, regExp: regExpress.noNumber },
    {
      ...getTextBox('ValidationCode', '图形验证码', '', 5, 1, '请输入图形验证码', 6), isEdit: true, isRed: true,
      type: 'ImageVerifyCode', rowClassName: "divRow2", isNullable: false, propertyName2: 'ValidationCodeUID'
    },
    {
      ...getTextBox('CallNumberValidCode', '短信验证码', '', 6, 1, '请输入短信验证码', 6), isEdit: true, isRed2: true,
      saveEntityDataActionType: dataActionTypes.sendSms, regExp: regExpress.noNumber,
      type: 'SendVerifyCode', rowClassName: "divRow2", sendSmsEventActionName: 'sendSms', isNullable: true
    },
    { ...getTextBox('FirstName', '名称', '', 7, 1, '请输入名称', 50), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: true, isRed2: true },
    { ...getTextBox('LastName', '姓氏', '', 8, 1, '请输入姓氏', 30), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: true, isRed2: true },
    { ...getTextBox('Email', '邮箱', '', 9, 1, '请输入邮箱', 50), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: true, isRed2: true },
    { ...getTextBox('Pwd', '密码', 'password', 10, 1, '请输入密码', 50), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: true, isRed2: true },
    { ...getTextBox('AgainPwd', '确认密码', 'password', 11, 1, '请输入密码', 50), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: true, isRed2: true },
    { ...getButton('register', '注册', 'primary', 18, 1), saveEntityDataActionType: dataActionTypes.register, className: 'loginButton', eventActionName: 'register', rowClassName: "divRow3" }
  ]
}

function getRegisterProperties() {
  return [
    { ...getTextBox('CallNumberCode', '手机', '', 1, 1, '', 20), isEdit: true, disabled: true, rowClassName: "divRow2" },
    { ...getTextBox('FirstName', '名称', '', 2, 1, '请输入名称', 50), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false, isRed: true },
    { ...getTextBox('LastName', '姓氏', '', 3, 1, '请输入姓氏', 30), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false, isRed: true },
    { ...getTextBox('Email', '邮箱', '', 4, 1, '请输入邮箱', 50), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false, isRed: true },
    { ...getTextBox('Company', '公司/院校', '', 5, 1, '可选填', 50), isEdit: true, rowClassName: "divRow2", clear: true },
    { ...getTextBox('Department', '部门/院系', '', 6, 1, '可选填', 50), isEdit: true, rowClassName: "divRow2", clear: true },
    { ...getTextBox('Pwd', '密码', 'password', 7, 1, '请输入密码', 50), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false, isRed: true },
    { ...getTextBox('AgainPwd', '确认密码', 'password', 8, 1, '请输入密码', 50), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false, isRed: true },
    {
      name: 'isUseInviteCode', type: 'CheckBox', isListItem: true, text: '使用邀请码', isEdit: true, rowClassName: "divRow2", x: 9, y: 1,
      valueVisibleProperties: { 0: ['inviteCodeTip'], 1: ['InvitationCode'] }
    },
    { ...getSpanText('inviteCodeTip', 'divTipText', 10, 1), isDiv: false, text: '请填写邀请码，以获取更多积分', isListItem: true, rowClassName: "divRow2" },
    { ...getTextBox('InvitationCode', '邀请码', '', 11, 1, '请输入邀请码', 20), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false, isVisible: false, isRed: true },
    {
      name: 'ApplyUserRole', type: 'CheckBox', isListItem: true, text: '升级User账号', isEdit: true, rowClassName: "divRow2", x: 12, y: 1,
      valueVisibleProperties: { 1: ['LabAccount', 'LabIDTip'] }
    },
    { ...getSpanText('userAccountTip', 'divTipText', 13, 1), isDiv: false, text: '仅限HORIBA仪器用户', isListItem: true, rowClassName: "divRow2" },
    { ...getTextBox('LabAccount', 'Lab ID', '', 14, 1, '请输入Lab ID', 50), isEdit: true, rowClassName: "divRow2", clear: true, isNullable: false, isVisible: false, isRed: true },
    { ...getSpanText('LabIDTip', 'divTipText', 15, 1), isVisible: false, isDiv: false, text: '请填写Lab ID以绑定实验室，从而升级为User account', isListItem: true, rowClassName: "divRow2" },
    { ...getSpanText('registerTip', 'divTipText2', 16, 1), isDiv: false, text: '如果同意相关条款及隐私和数据保护申明，请点击“注册”继续', isListItem: true, rowClassName: "divRow2" },

    { ...getButton('linkLabAccount', '申请Lab Account', 'ghost', 17, 1), className: 'loginButton', eventActionName: 'linkLabAccount', rowClassName: "divRow3" },
    { ...getButton('register', '注册', 'primary', 18, 1), saveEntityDataActionType: dataActionTypes.register, className: 'loginButton', eventActionName: 'register', rowClassName: "divRow3" }
  ]
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
    name: "verifyCallNumberCode",
    type: "entityEdit/saveEntityData",
    editView: "editView",
    successCallback: "verifyCallNumberCodeSuccess",
    failedCallback: "sendSmsFailed",
  },
  {
    name: 'linkLabAccount',
    type: 'page/openUrl',
    pageUrl: 'https://jinshuju.net/f/p5EdW1'
  },
  {
    name: "register",
    type: "entityEdit/saveEntityData",
    editView: "editView",
    successCallback: "registerSuccess"
  }]
}
