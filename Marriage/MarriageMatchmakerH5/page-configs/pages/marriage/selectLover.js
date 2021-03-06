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
    url: '/marriage/selectConditionType?&userId=#{userId}&marriageArrangeId=#{marriageArrangeId}&ConditionTypeId=#{ConditionTypeId}&UserConditionTypeId=#{UserConditionTypeId}&title=' + encodeURIComponent('择偶标准-') + '#{ConditionTypeName}',
    serviceDataSource: getConditionTypeDataSource()
  }
}

function getConditionTypeDataSource() {
  return {
    valueName: "UserItemCount",
    textName: "ConditionTypeName",
    stateName: "getUserConditionTypesByMatchmaker",
    serviceName: "MarriageUserService",
    actionName: "getUserConditionTypesByMatchmaker",
    isRefresh: true,
    getPayload: 'getUserConditionTypesPayload',
    payload: { SelectType: 2 }
  }
}