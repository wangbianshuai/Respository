//marriage/detail 2000-2099
const dataActionTypes = {
  getUserByMatchmaker: 2000
};

module.exports = {
  name: "index",
  type: "View",
  eventActions: getEventActions(),
  properties: [getInfoView()]
}

function getInfoView() {
  return {
      name: "infoView",
      type: "View",
      entity: { name: 'MarriageUser', primaryKey: 'UserId', isGet: true },
      eventActionName: "getUserByMatchmaker",
      getEntityDataActionType: dataActionTypes.getUserByMatchmaker,
      properties: getProperties()
  }
}
function getProperties() {
  return [
      getUserInfoView(),
      getPhotoListMenu(),
      getConditionTypeListMenu(),
      getSelectLoverListMenu()
  ]
}

function getUserInfoView() {
  return {
      name: 'UserInfo',
      type: 'topMarriageArrangeInfo',
      detailUrl: '/marriage/userInfo?userId=#{userId}&marriageArrangeId=#{marriageArrangeId}'
  }
}

function getEventActions() {
  return [{
      name: "getUserByMatchmaker",
      type: "entityEdit/getEntityData",
      editView: "infoView"
  }]
}

function getPhotoListMenu() {
  return {
      name: 'UserPhoto',
      type: 'ListMenu',
      className: 'divListMenu',
      dataSource: [{ text: '生活照', arrow: 'horizontal', thumb: 'photo.png', url: '/marriage/userPhoto?userId=#{userId}&marriageArrangeId=#{marriageArrangeId}' }]
  }
}

function getSelectLoverListMenu() {
  return {
      name: 'SelectLover',
      type: 'ListMenu',
      className: 'divListMenu',
      isShowValue:false,
      isHasValueVisible: true,
      dataSource: [{ text: '择偶标准', arrow: 'horizontal', thumb: 'select_lover.png', url: '/marriage/selectLover?userId=#{userId}&marriageArrangeId=#{marriageArrangeId}' }]
  }
}

function getConditionTypeListMenu() {
  return {
      name: 'conditionTypes',
      type: 'ListMenu',
      className: 'divConditionListMenu',
      isRightArraw: true,
      url: '/marriage/conditionType?userId=#{userId}&marriageArrangeId=#{marriageArrangeId}&ConditionTypeId=#{ConditionTypeId}&UserConditionTypeId=#{UserConditionTypeId}&title=' + encodeURIComponent('条件信息-') + '#{ConditionTypeName}',
      serviceDataSource: getConditionTypeDataSource()
  }
}

function getConditionTypeDataSource() {
  return {
      valueName: "Percentage",
      textName: "ConditionTypeName",
      stateName: "getUserConditionTypesByMatchmaker",
      serviceName: "MarriageArrangeUserService",
      actionName: "getUserConditionTypesByMatchmaker",
      isRefresh: true,
      getPayload: 'getUserConditionTypesPayload',
      payload: { SelectType: 1, }
  }
}