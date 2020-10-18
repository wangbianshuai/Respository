const { getSpanText, getTextBox, getDateIconText, getHtmlContent, createGuid, getRadio } = require('../../common');

//detail/library 600-699
const dataActionTypes = {
  //get entity data
  getEntityData: 600,
  //Save entity data
  saveEntityData: 601,
  //collect
  collect: 602,
  //产品咨询
  consult: 603
};

const entity = { name: 'Library', primaryKey: 'UID' };

module.exports = {
  name: "library",
  type: "View",
  dialogViews: getDialogViews(),
  eventActions: getEventActions(),
  properties: [getTabs(), getEditView()]
}

function getEditView() {
  return {
    name: "editView",
    type: "View",
    isDiv: true,
    className: 'divDetail',
    properties: [getEditView2()]
  }
}

function getEditView2() {
  return {
    name: "libraryEdit",
    type: "RowsColsView",
    isDiv: true,
    className: 'divDetail2',
    entity: entity,
    eventActionName: "getEntityData",
    formData: {
      Param: { FromMinisite: true },
      Act: 'Library_GetSingleInfo',
      dataPrimaryKey: 'LibraryUID'
    },
    getEntityDataActionType: dataActionTypes.getEntityData,
    properties: getProperties()
  }
}

function getTabs() {
  return {
    name: 'tabs1',
    type: 'Tabs',
    isDiv: true,
    className: 'tabDetail',
    tabs: [{ title: '全部', url: "/library/index?tabPage=0" },
    { title: 'Paper', url: "/library/index?tabPage=1" },
    { title: '应用文档', url: "/library/index?tabPage=2" },
    { title: '技术文档', url: "/library/index?tabPage=3" },
    { title: '入门手册', url: "/library/index?tabPage=4" },
    { title: '产品中心', url: "/library/index?tabPage=5" }]
  }
}

function getProperties() {
  return [
    getSpanText('Title', 'divTitle', 1, 1),
    { ...getDateIconText('PublishedDate', 'divDate', 2, 1) },
    { name: 'favoritesStart', type: 'FavoritesStar', x: 2, y: 2, articleType: 10 },
    getHtmlContent('Abstract', 'divContent', 3, 1),
    { name: 'WormPaperUrl', type: 'LinkPageUrl', x: 4, y: 1, className: 'divLinkDetail' },
    getRecommendRead()
  ]
}


function getEventActions() {
  return [{
    name: "getEntityData",
    type: "entityEdit/getEntityData",
    editView: "libraryEdit",
    setGetEntityDataLoad: 'setGetEntityDataLoad'
  },
  {
    name: "showDialogConsultView",
    type: "dialog/showDialogEntityEdit",
    dialogView: "consultView",
    editView: "consultEditView",
    failedCallback: "consultFailed"
  }]
}

function getRecommendRead() {
  return {
    name: 'recommendRead',
    type: 'recommendRead',
    className: "divRecommendRead",
    textName: 'Title',
    primaryKey: 'UID',
    x: 5,
    y: 1,
    detailPageUrl: '/detail/library'
  }
}

function getDialogViews() {
  return [getConsultView()]
}

function getConsultView() {
  return {
    id: createGuid(),
    dialogId: createGuid(),
    name: "consultView",
    type: "View",
    className: 'divDialog',
    wrapClassName: 'divWrapDialog',
    okText: '提交留言',
    properties: [getConsultEditView()]
  }
}

function getConsultEditView() {
  return {
    name: "consultEditView",
    type: "RowsColsView",
    entity,
    isClear: true,
    saveEntityDataActionType: dataActionTypes.consult,
    successTip: "提交成功",
    properties: [
      {
        ...getRadio('RequireType', '', getRequireDataSource(), 1, 1, 1), label: '需求', className: 'divReqiure', isEdit: true
      },
      getTextBox2('Description', '详细需求说明:', 'textarea', 2, 1, '请输入详细需求说明', 500, false),
      {
        ...getTextBox('ValidationCode', '验证码', '', 6, 1, '请输入验证码', 6), isEdit: true,
        type: 'ImageVerifyCode', rowClassName: "divRow2", isNullable: false, propertyName2: 'ValidationCodeUID'
      }
    ]
  }
}

function getRequireDataSource() {
  return [{ value: 1, text: '半年内有采购需求' }, { value: 2, text: '1年内有采购需求' }, { value: 3, text: ' 了解相关技术，了解相关解决方案， 为以后采购做准备' }]
}

function getTextBox2(name, label, controlType, x, y, placeHorder, maxLength, isNullable) {
  return { ...getTextBox(name, label, controlType, x, y, placeHorder, maxLength), isEdit: true, clear: false, isNullable }
}
