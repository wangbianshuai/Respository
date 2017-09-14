//扩展方法

const Entity = {}

//扩展设置编辑数据
Entity.ExpandSetEditData = function (data, blUpdate, ns) { return data }

//扩展获取编辑数据
Entity.ExpandGetEditData = function (data, ns) { }

//扩展面页初始化
Entity.ExpandPageInit = function (ns) { }

//扩展设置属性数据源数据列表
Property.ExpandSetDataList = function (dataList, ns) { return dataList }


//扩展设置查询请求
Entity.ExpandQueryRequest = function (request, ns) { return request }