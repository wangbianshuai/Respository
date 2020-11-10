//boygirl/index 500-599
const dataActionTypes = {
  //搜索查询  待审核
  searchQuery: 500,
  //男生
  searchBoy: 501,
  //女生
  searchGirl: 502,
  //审核不通过
  searchNoPass: 503,
};

const entity = { name: 'MarriageUser', primaryKey: 'UserId' };

module.exports = {
  name: "index",
  type: "View",
  eventActions: getEventActions(),
  properties: [getTabs()]
}

function getTabs() {
  return {
    name: 'tabs1',
    type: 'Tabs',
    properties: [
      getTabView('userDataGridView1', '待审核', 0, 'searchQuery', dataActionTypes.searchQuery, {
        Status: 0
      }),
      getTabView('boyDataGridView1', '男生', 1, 'searchBoy', dataActionTypes.searchBoy, {
        Status: 1,
        Sex: '1'
      }),
      getTabView('girlDataGridView1', '女生', 2, 'searchGirl', dataActionTypes.searchGirl, {
        Status: 1,
        Sex: '2'
      }),
      getTabView('noPassDataGridView1', '审核不通过', 3, 'searchNoPass', dataActionTypes.searchNoPass, {
        Status: 2,
      })
    ]
  }
}

function getEventActions() {
  return [
    {
      name: "searchQuery",
      type: "dataGridView/searchQuery",
      dataGridView: "userDataGridView1"
    },
    {
      name: "searchBoy",
      type: "dataGridView/searchQuery",
      dataGridView: "boyDataGridView1"
    },
    {
      name: "searchGirl",
      type: "dataGridView/searchQuery",
      dataGridView: "girlDataGridView1"
    },
    {
      name: "searchNoPass",
      type: "dataGridView/searchQuery",
      dataGridView: "noPassDataGridView1"
    }]
}

function getTabView(name, tabLabel, tabPage, eventActionName, entitySearchQuery, conditions) {
  return {
    name,
    tabLabel,
    type: "DataGridView",
    properties: [],
    entity,
    conditions,
    entitySearchQuery,
    eventActionName,
    detailPageUrl: '/boygirl/detail?tabPage=' + tabPage,
    actionName: eventActionName,
    className: "divDataGridView",
    itemType: 'MarriageUserItem'
  }
}