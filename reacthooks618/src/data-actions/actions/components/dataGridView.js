import { Common } from 'UtilsCommon';
import BaseIndex from "../../baseIndex";

export default class DataGridView extends BaseIndex {
  constructor(props) {
    super(props);

    this.name = "components_dataGridView";
    this.minActionType = 300;
    this.maxActionType = 399;

    this.init();
  }

  searchQuery(id, actionType, data) {
    const { queryInfo, pageSize, pageIndex, entity, isData } = data;

    const entityName = entity.viewName || entity.name;

    const methodName = entity.isGroupByInfo ? entity.queryPageUrl || "/Select2" : "";

    var dataUrl = `${entityName}?$query=true&$data=true&pagesize=${pageSize}&pageindex=${pageIndex}`;
    var pageUrl = `${entityName}${methodName}?$query=true&$page=true&pagesize=${pageSize}&pageindex=${pageIndex}`;

    if (entity.isGroupByInfo) pageUrl = Common.addUrlParams(pageUrl, "$groupbyinfo", "true");

    const requestList = [];

    requestList.push({ url: dataUrl, data: { QueryInfo: queryInfo } });
    if (!isData) requestList.push({ url: pageUrl, data: { QueryInfo: queryInfo } });

    data.requestList = requestList;

    if (data.entitySearchQuery) {
      data.dataGridViewSearchQuery = actionType;
      data.entityName = entityName;
      this.invokeAction(id, data.entitySearchQuery, data);
    }
  }

  setsearchQuery(id, action, data) {
    if (!this.receives[id]) return false;
    return data;
  }

  excelExport(id, actionType, data) {
    const { queryInfo, entity, title } = data;

    const entityName = entity.viewName || entity.name;

    var dataUrl = `?$query=true&Action=Excel&Title=${escape(title)}&EntityName=${entityName}`;

    if (data.entityExcelExport) {
      this.invokeAction(id, data.entityExcelExport, { pathQuery: dataUrl, dataGridViewExcelExport: actionType, QueryInfo: queryInfo });
    }
  }

  setexcelExport(id, action, data) {
    if (!this.receives[id]) return false;
    return data;
  }
}
