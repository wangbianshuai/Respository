const { getMoveSelect2 } = require('../../common');

//library/index 500-599
const dataActionTypes = {
  //搜索查询 全部
  searchQuery: 500,
  //Paper
  searchPaper: 501,
  //应用文档
  searchAppDocument: 502,
  //入门手册
  searchBaedeker: 503,
  //产品中心
  searchProduct: 504,
  //技术文档
  searchTechnique: 505,
};

const entity = { name: 'Library', primaryKey: 'UID' };

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
    swipeable: false,
    properties: [
      getPanelView('libraryView', '全部', 'libraryConditionView', 'searchQuery', getTabView('libraryDataGridView1', '全部', 0, 'searchQuery', dataActionTypes.searchQuery, {
        Param: { LibraryIndex: "ClicksDesc", "SetTopIndex": true },
        Act: 'Library_GetList'
      })),
      getPanelView('paperView', 'Paper', 'paperConditionView', 'searchPaper', getTabView('paperDataGridView1', 'Paper', 1, 'searchPaper', dataActionTypes.searchPaper, {
        Param: { LibraryIndex: "ClicksDesc", "SetTopIndex": true, LibraryTypeUID: "e30b5335-ebf4-4ede-be92-9417bb6f1048" },
        Act: 'Library_GetList'
      })),
      getPanelView('appDocumentView', '应用文档', 'appDocumentConditionView', 'searchAppDocument', getTabView('appDocumentDataGridView1', '应用文档', 2, 'searchAppDocument', dataActionTypes.searchAppDocument, {
        Param: { LibraryIndex: "ClicksDesc", "SetTopIndex": true, LibraryTypeUID: "4eb44483-c00c-4b9d-9229-843a7c065d53" },
        Act: 'Library_GetList'
      })),
      getPanelView('techniqueView', '技术文档', 'techniqueConditionView', 'searchTechnique', getTabView('techniqueDataGridView1', '技术文档', 3, 'searchTechnique', dataActionTypes.searchTechnique, {
        Param: { LibraryIndex: "ClicksDesc", "SetTopIndex": true, LibraryTypeUID: "a08c9c97-5272-46d1-8d63-88bfffbc84b4" },
        Act: 'Library_GetList'
      })),
      getPanelView('baedekerView', '入门手册', 'baedekerConditionView', 'searchBaedeker', getTabView('baedekerDataGridView1', '入门手册', 4, 'searchBaedeker', dataActionTypes.searchBaedeker, {
        Param: { LibraryIndex: "ClicksDesc", "SetTopIndex": true, LibraryTypeUID: "28b32ffc-8ad1-403a-878d-8891e4b46ed8" },
        Act: 'Library_GetList'
      })),
      getPanelView('productView', '产品中心', 'productConditionView', 'searchProduct', getTabView('productDataGridView1', '产品中心', 5, 'searchProduct', dataActionTypes.searchProduct, {
        Param: { LibraryIndex: "ClicksDesc", "SetTopIndex": true, LibraryTypeUID: "8da9bd02-dd48-458e-b798-85a0ae5ee684" },
        Act: 'Library_GetList'
      }, 'TopProductCenterItem', 'divDataGridView3'))
    ]
  }
}

function getPanelView(panelViewName, tabLabel, conditionViewName, valueChangeEventActionName, tabView) {
  return {
    name: panelViewName,
    type: 'View',
    isDiv: true,
    className: 'divPanelView',
    tabLabel,
    properties: getPanelProperties(conditionViewName, valueChangeEventActionName, tabView)
  }
}

function getPanelProperties(conditionViewName, valueChangeEventActionName, tabView) {
  return [
    getConditionView(conditionViewName, valueChangeEventActionName),
    tabView
  ]
}

function getConditionView(name, valueChangeEventActionName) {
  return {
    name: name,
    type: 'View',
    isDiv: true,
    className: 'divConditionView',
    properties: getConditionProperties(valueChangeEventActionName)
  }
}

function getConditionProperties(valueChangeEventActionName) {
  return [
    { ...getMoveSelect2('ApplicationUID', '应用领域', getApplicationServiceDataSource()), isCondition: true, valueChangeEventActionName, listName: 'List', emptyOption: { value: '', label: '所有应用' } },
    { ...getMoveSelect2('TechniqueUID', '光谱技术', getTechniqueServiceDataSource()), isCondition: true, valueChangeEventActionName, listName: 'List', emptyOption: { value: '', label: '所有技术' } }
  ]
}

function getApplicationServiceDataSource() {
  return {
    stateName: "getApplications",
    serviceName: "LibraryService",
    actionName: "getApplications",
    valueName: 'UID',
    textName: 'CnName',
    payload: {
      formData: {
        Param: '{}',
        Act: 'Application_GetList'
      }
    }
  }
}

function getTechniqueServiceDataSource() {
  return {
    stateName: "getTechniques",
    serviceName: "LibraryService",
    actionName: "getTechniques",
    valueName: 'UID',
    textName: 'Name',
    payload: {
      formData: {
        Param: '{}',
        Act: 'Technique_GetList'
      }
    }
  }
}

function getEventActions() {
  return [
    {
      name: "searchQuery",
      type: "dataGridView/searchQuery",
      dataGridView: "libraryDataGridView1",
      searchView: "libraryConditionView"
    },
    {
      name: "searchPaper",
      type: "dataGridView/searchQuery",
      dataGridView: "paperDataGridView1",
      searchView: "paperConditionView"
    },
    {
      name: "searchAppDocument",
      type: "dataGridView/searchQuery",
      dataGridView: "appDocumentDataGridView1",
      searchView: "appDocumentConditionView"
    },
    {
      name: "searchBaedeker",
      type: "dataGridView/searchQuery",
      dataGridView: "baedekerDataGridView1",
      searchView: "baedekerConditionView"
    },
    {
      name: "searchTechnique",
      type: "dataGridView/searchQuery",
      dataGridView: "techniqueDataGridView1",
      searchView: "techniqueConditionView"
    },
    {
      name: "searchProduct",
      type: "dataGridView/searchQuery",
      dataGridView: "productDataGridView1",
      searchView: "productConditionView"
    }
  ]
}

function getTabView(name, tabLabel, tabPage, eventActionName, entitySearchQuery, formData, itemType, className) {
  return {
    name,
    tabLabel,
    type: "DataGridView",
    properties: [],
    entity,
    formData,
    isHideCondition: true,
    entitySearchQuery,
    eventActionName,
    detailPageUrl: '/detail/library?tabPage=' + tabPage,
    actionName: eventActionName,
    className: className || "divDataGridView2",
    itemType: itemType || 'TopEdgeAppItem'
  }
}