module.exports = {
  name: "selectLover",
  type: "View",
  properties: [getInfoView()]
}

function getInfoView() {
  return {
    name: "infoView",
    type: "View",
    properties: getProperties()
  }
}
function getProperties() {
  return [
    getTitleView(),
    getConditionTypeListMenu()
  ]
}

function getTitleView() {
  return {
    name: 'title',
    type: 'NavBar',
    mode: 'mark',
    text: '择偶标准'
  }
}

function getConditionTypeListMenu() {
  return {
    name: 'conditionTypes',
    type: 'ListMenu',
    className: 'divConditionListMenu',
    isRightArraw: true,
    url: '/mine/selectConditionType?conditionType=#{ConditionTypeId}&userCoditionType=#{UserConditionTypeId}&title='+ encodeURIComponent('择偶标准-')+'#{ConditionTypeName}',
    serviceDataSource: getConditionTypeDataSource()
  }
}

function getConditionTypeDataSource() {
  return {
    valueName: "UserItemCount",
    textName: "ConditionTypeName",
    stateName: "getUserConditionTypes",
    serviceName: "MarriageUserService",
    actionName: "getUserConditionTypes",
    isRefresh: true,
    payload: { SelectType: 2 }
  }
}