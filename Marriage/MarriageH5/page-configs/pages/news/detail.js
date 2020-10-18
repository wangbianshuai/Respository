const { getSpanText, getDateIconText, getHtmlContent } = require('../../common');

//news/detail 400-499
const dataActionTypes = {
  //get entity data
  getEntityData: 400,
  //Save entity data
  saveEntityData: 401
};

const entity = { name: 'News', primaryKey: 'UID' };

module.exports = {
  name: "detail",
  type: "View",
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
    name: "detailEdit",
    type: "View",
    isDiv: true,
    className: 'divDetail2',
    entity: entity,
    eventActionName: "getEntityData",
    formData: {
      Param: {},
      Act: 'News_GetSingleInfo',
      dataPrimaryKey: 'NewsUID'
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
    className: "tabNewsDetail",
    isChangeClassName: true,
    subIndex: 2,
    tabs: [{ title: '全部', url: "/news/index?tabPage=0" },
    { title: '学术简讯', url: "/news/index?tabPage=1" },
    { title: '前沿用户报道', url: "/news/index?tabPage=2" },
    { title: '光谱技术头条', url: "/news/index?tabPage=3" },
    { title: '微课堂', url: "/news/index?tabPage=4" },
    { title: '技术进阶', url: "/news/index?tabPage=5" },
    { title: '光谱学院', url: "/news/index?tabPage=6" },
    { title: '其他', url: "/news/index?tabPage=7" }]
  }
}

function getProperties() {
  return [
    getSpanText('NewsTitle', 'divTitle'),
    getDateIconText('NewsDate', 'divDate'),
    getHtmlContent('NewsContent', 'divContent')
  ]
}


function getEventActions() {
  return [{
    name: "getEntityData",
    type: "entityEdit/getEntityData",
    editView: "detailEdit"
  }]
}

