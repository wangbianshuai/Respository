//marriage/detail 1400-1499
const dataActionTypes = {
  getEntityData: 1400
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
    entity: { name: 'MarriageArrange', primaryKey: 'marriageArrangeId' },
    eventActionName: "getEntityData",
    getEntityDataActionType: dataActionTypes.getEntityData,
    properties: getProperties()
  }
}
function getProperties() {
  return [
    getMarriageArrangeInfoView('ManUserInfo'),
    getMarriageArrangeInfoView('WomanUserInfo'),
    getMarriageArrangeListMenu(),
    getMarriageFeeListMenu(),
    getManMatchmakerListMenu(),
    getWomanMatchmakerListMenu(),
    getAppMatchmakerListMenu(),
    getStatusListMenu(),
  ]
}

function getMarriageArrangeInfoView(name) {
  return {
    name,
    type: 'topMarriageArrangeInfo',
    detailUrl: '/marriage/userdetail?userId=#{UserId}&marriageArrangeId=#{marriageArrangeId}'
  }
}

function getEventActions() {
  return [{
    name: "getEntityData",
    type: "entityEdit/getEntityData",
    editView: "infoView"
  }]
}

function getManMatchmakerListMenu() {
  return {
    name: 'ManMatchmaker',
    type: 'MatchmakerListMenu',
    className: 'divListMenu',
    label:'男方红娘'
  }
}

function getWomanMatchmakerListMenu() {
  return {
    name: 'WomanMatchmaker',
    type: 'MatchmakerListMenu',
    className: 'divListMenu',
    label:'女方红娘'
  }
}
function getAppMatchmakerListMenu() {
  return {
    name: 'AppMatchmaker',
    type: 'MatchmakerListMenu',
    className: 'divListMenu',
    label:'平台红娘'
  }
}

function getMarriageArrangeListMenu() {
  return {
    name: 'MarriageArrange',
    type: 'ListMenu',
    className: 'divListMenu',
    dataSource: [{ text: '相亲安排', arrow: 'horizontal', thumb: 'marriage_selected.png', url: '/marriage/marriageArrange?marriageArrangeId=#{marriageArrangeId}' }]
  }
}

function getMarriageFeeListMenu() {
  return {
    name: 'MarriageFee',
    type: 'ListMenu',
    isHasValueVisible: true,
    className: 'divListMenu',
    dataSource: [{ text: '相亲费用', arrow: 'horizontal', thumb: 'fee.png', url: '/marriage/marriageFee?marriageArrangeId=#{marriageArrangeId}' }]
  }
}

function getStatusListMenu() {
  return {
    name: 'StatusInfo',
    type: 'ArrangeStatusListMenu',
    arrow: 'horizontal',
    isMenu: true,
    url: '/marriage/marriageStatus?marriageArrangeId=#{marriageArrangeId}',
    className: 'divListMenu',
  }
}