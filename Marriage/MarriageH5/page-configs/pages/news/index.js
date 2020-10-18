//news/index 200-299
const dataActionTypes = {
  //搜索查询 全部
  searchQuery: 200,
  //活动报道
  searchActivity: 201,
  //行业动态
  searchIndustry: 202,
  //技术资讯
  searchTechnical: 203,
  //微课堂
  searchClassroom: 204,
  //技术进阶
  searchAdvanced: 205,
  //光谱学院
  searchSpectral: 206,
  //其他
  searchOther: 207
};

const entity = { name: 'News', primaryKey: 'UID' };

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
    isDiv: true,
    isChangeClassName: true,
    subIndex: 2,
    className: "newsTabs",
    properties: [
      getTabView('newsDataGridView1', '全部', 0, 'searchQuery', dataActionTypes.searchQuery, {
        Param: { NewsIndex: "DateTimeDesc" },
        Act: 'News_GetList'
      }),
      getTabView('activityDataGridView1', '学术简讯', 1, 'searchActivity', dataActionTypes.searchActivity, {
        Param: { NewsIndex: "DateTimeDesc", NewsType: '0' },
        Act: 'News_GetList'
      }),
      {
        ...getTabView('industryDataGridView1', '前沿用户报道', 2, 'searchIndustry', dataActionTypes.searchIndustry, {
          Param: { NewsIndex: "DateTimeDesc", NewsType: '10' },
          Act: 'News_GetList'
        }), prefixCls: 'tabTitle2'
      },
      {
        ...getTabView('technicalDataGridView1', '光谱技术头条', 3, 'searchTechnical', dataActionTypes.searchTechnical, {
          Param: { NewsIndex: "DateTimeDesc", NewsType: '20' },
          Act: 'News_GetList'
        }), prefixCls: 'tabTitle2'
      },
      getTabView('classroomDataGridView1', '微课堂', 4, 'searchClassroom', dataActionTypes.searchClassroom, {
        Param: { NewsIndex: "DateTimeDesc", NewsType: '30' },
        Act: 'News_GetList'
      }),
      getTabView('advancedDataGridView1', '技术进阶', 5, 'searchAdvanced', dataActionTypes.searchAdvanced, {
        Param: { NewsIndex: "DateTimeDesc", NewsType: '40' },
        Act: 'News_GetList'
      }),
      getTabView('spectralDataGridView1', '光谱学院', 6, 'searchSpectral', dataActionTypes.searchSpectral, {
        Param: { NewsIndex: "DateTimeDesc", NewsType: '50' },
        Act: 'News_GetList'
      }),
      getTabView('otherDataGridView1', '其他', 7, 'searchOther', dataActionTypes.searchOther, {
        Param: { NewsIndex: "DateTimeDesc", NewsType: '60' },
        Act: 'News_GetList'
      })
    ]
  }
}

function getEventActions() {
  return [
    {
      name: "searchQuery",
      type: "dataGridView/searchQuery",
      dataGridView: "newsDataGridView1"
    },
    {
      name: "searchActivity",
      type: "dataGridView/searchQuery",
      dataGridView: "activityDataGridView1"
    },
    {
      name: "searchIndustry",
      type: "dataGridView/searchQuery",
      dataGridView: "industryDataGridView1"
    },
    {
      name: "searchTechnical",
      type: "dataGridView/searchQuery",
      dataGridView: "technicalDataGridView1"
    },
    {
      name: "searchClassroom",
      type: "dataGridView/searchQuery",
      dataGridView: "classroomDataGridView1"
    },
    {
      name: "searchAdvanced",
      type: "dataGridView/searchQuery",
      dataGridView: "advancedDataGridView1"
    },
    {
      name: "searchSpectral",
      type: "dataGridView/searchQuery",
      dataGridView: "spectralDataGridView1"
    },
    {
      name: "searchOther",
      type: "dataGridView/searchQuery",
      dataGridView: "otherDataGridView1"
    }
  ]
}

function getTabView(name, tabLabel, tabPage, eventActionName, entitySearchQuery, formData) {
  return {
    name,
    tabLabel,
    type: "DataGridView",
    properties: [],
    entity,
    formData,
    entitySearchQuery,
    eventActionName,
    detailPageUrl: '/news/detail?tabPage=' + tabPage,
    actionName: eventActionName,
    className: "divDataGridView",
    itemType: 'TopActivityItem'
  }
}