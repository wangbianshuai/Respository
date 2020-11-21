//mine/matchmakerFee 2500-2599
const dataActionTypes = {
  //搜索查询  
  searchQuery: 2500
};

const entity = { name: 'MatchmakerFeeDetail', primaryKey: 'DetailId' };

module.exports = {
  name: "index",
  type: "View",
  className: 'divView3',
  isDiv: true,
  eventActions: getEventActions(),
  properties: [getTitleView(),
  getTabView('feeDataGridView1', 'searchQuery', dataActionTypes.searchQuery)]
}

function getTitleView() {
  return {
    name: 'title',
    type: 'NavBar',
    mode: 'mark',
    className: "divNavBar",
    text: '红包明细'
  }
}

function getEventActions() {
  return [
    {
      name: "searchQuery",
      type: "dataGridView/searchQuery",
      dataGridView: "feeDataGridView1"
    }]
}

function getTabView(name, eventActionName, entitySearchQuery) {
  return {
    name,
    type: "DataGridView",
    properties: [],
    entity,
    conditions: {},
    entitySearchQuery,
    eventActionName,
    actionName: eventActionName,
    className: "divDataGridView",
    itemType: 'MatchmakerFeeItem'
  }
}