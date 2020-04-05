import { Common } from "UtilsCommon";
import BaseIndex from "./baseIndex";

export default class DataGridView extends BaseIndex {

  searchQuery(props, action) {
    if (!action.parameters) this.initSearchQueryAction(props, action);

    action.isSearch = props.property.type !== "DataGridView";
    this.searchData(props, action.parameters, props.pageIndex || 1, props.pageSize || 10, action.isClearQuery);
  }

  initSearchQueryAction(props, action) {
    const { property, pageAxis } = props;
    //判断props.property 是 查询按钮或搜索框 还是DataGridView
    const dataGridView = property.type === "DataGridView" ? property : pageAxis.getProperty(action.dataGridView);
    const searchButton = property.type === "DataGridView" ? pageAxis.getProperty(action.searchButton) : property;
    const searchView = pageAxis.getProperty(action.searchView);
    const alertMessage = pageAxis.getProperty(action.alertMessage);
    const expandSearchQueryLoad = pageAxis.getFunction(action.expandSearchQueryLoad)
    action.parameters = { dataGridView, searchButton, searchView, alertMessage, expandSearchQueryLoad }
  }

  searchData(props, parameters, pageIndex, pageSize, isClearQuery) {
    const { dataGridView, searchButton } = parameters;
    const { actionTypes, invoke, entitySearchQuery } = dataGridView;
    const { searchQuery } = actionTypes;
    const { pageAxis, isData } = props;

    const conditionList = this.getConditionList(parameters, isClearQuery);
    if (conditionList === false) return;

    const queryInfo = this.getQueryInfo(dataGridView);
    queryInfo.WhereFields = conditionList;

    dataGridView.searchButton = searchButton;
    dataGridView.queryInfo = queryInfo;
    dataGridView.pageSize = pageSize;
    searchButton && searchButton.setDisabled(true);

    const data = { entitySearchQuery, entity: dataGridView.entity, isData, pageIndex, pageSize, queryInfo, pageData: pageAxis.pageData }

    invoke(searchQuery, data);
  }

  receivesearchQuery(data, props) {
    const { pageAxis, property, isData } = props;
    const action = pageAxis.getEventAction(property.eventActionName);
    if (!action.parameters) this.initSearchQueryAction(props, action);
    const { alertMessage, expandSearchQueryLoad } = action.parameters;

    const searchButton = property.searchButton || action.parameters.searchButton;

    let pageRecord = data.pageRecord || 0;
    if (data.pageInfo) pageRecord = data.pageInfo.PageRecord;

    //设置提示信息
    let msg = ""
    if (data.isSuccess === false) {
      msg = data.message;
      if (!alertMessage) this.alert(msg, pageAxis.showMessage);
    }
    else if ((action.isSearch || !action.isQuery) && !isData) msg = `符合当前查询条件的结果总计${pageRecord}条！`;

    action.isQuery = true;

    if (msg && alertMessage) alertMessage.setValue(msg);

    //设置搜索按钮
    searchButton && searchButton.setDisabled(false);

    if (expandSearchQueryLoad) expandSearchQueryLoad({ data, props })
  }

  getConditionList(parameters, isClearQuery) {
    const { searchView } = parameters;
    if (!searchView) return {};

    const conditionList = [];
    searchView.properties.forEach(p => {
      const name = p.propertyName || p.name;
      if (p.isCondition && p.getValue) conditionList.push({ Name: name, Label: p.label, OperateLogic: p.operateLogic || "=", DataType: p.dataType || "string", Value: this.getPropertyValues(p, isClearQuery) });
    });

    if (Common.isArray(searchView.defaultConditions)) {
      searchView.defaultConditions.forEach(p => {
        var condition = {
          Name: p.name,
          Label: p.label,
          OperateLogic: p.operateLogic || "=",
          DataType: p.dataType || "string",
          Value: p.defaultValue
        }
        if (p.isCurrentUser) condition.Value = Common.getStorage("LoginUserId");

        if (!Common.isNullOrEmpty(condition.Value)) conditionList.push(condition)
      });
    }
    return conditionList;
  }

  getPropertyValues(p, isClearQuery) {
    if (isClearQuery) {
      p.setValue(p.defaultValue);
      return p.defaultValue;
    }
    return p.getValue();
  }

  getQueryInfo(dataGridView) {
    const primaryKey = dataGridView.entity.propertyPrimaryKey || dataGridView.entity.primaryKey;
    var property = null, isGroupBy = false, hasPrimaryKey = false, name = "";
    var queryInfo = {}, orderByList = [], groupByFieldList = [], groupByList = [], selectFieldList = [];
    var firstFieldOrderBy = "";
    for (var i = 0; i < dataGridView.properties.length; i++) {
      property = dataGridView.properties[i];
      if (dataGridView.isGroupByQuery && property.isVisible === false) continue;

      name = property.PropertyName || property.name;
      if (name === primaryKey) hasPrimaryKey = true;
      if (Common.isNullOrEmpty(property.groupByExpression)) {
        selectFieldList.push(name);
        if (!Common.isNullOrEmpty(property.orderByType)) {
          orderByList.push(name + " " + property.orderByType);
        }
        groupByList.push(name);

        if (!firstFieldOrderBy) firstFieldOrderBy = name + (property.orderByType || " desc");
      }
      else {
        isGroupBy = true;
        groupByFieldList.push(property.groupByExpression + " as " + name);
        if (!Common.isNullOrEmpty(property.orderByType)) {
          orderByList.push(property.groupByExpression + " " + property.orderByType);
        }

        if (!firstFieldOrderBy) firstFieldOrderBy = property.groupByExpression + (property.orderByType || " desc");
      }
    }

    if (!isGroupBy) {
      groupByList = [];
      if (!hasPrimaryKey) selectFieldList.splice(0, 0, primaryKey);
    }
    else if (orderByList.length === 0) orderByList.push(firstFieldOrderBy);

    queryInfo.HasLabel = selectFieldList.length === 0;
    queryInfo.FieldSql = selectFieldList.join(",");
    queryInfo.OrderBySql = orderByList.join(",");
    queryInfo.GroupBySql = groupByList.join(",");
    queryInfo.GroupByFieldSql = groupByFieldList.join(",");

    return queryInfo;
  }

  getConditions(parameters) {
    const { searchView } = parameters;
    if (!searchView) return {};

    const condition = {};
    searchView.properties.forEach(p => {
      const name = p.propertyName || p.name;
      if (p.isCondition && p.getValue) condition[name] = p.getValue();
    });

    return condition;
  }

  deleteEntityData(props, action) {
    const { property, pageAxis, entityData } = props;
    const { dataActionType, confirmTip, isSelfOperation, selfPropertyName } = action;
    const { entity } = property;

    if (isSelfOperation && pageAxis.loginUserId !== entityData[selfPropertyName]) {
      pageAxis.showMessage('The delete operation needs to be operated by myself!');
      return;
    }

    pageAxis.receives[dataActionType] = (d) => this.receivedeleteEntityData(d, props, action)

    const onOk = () => {
      pageAxis.invokeDataAction(dataActionType, { entity, entityData })
    };

    if (confirmTip) pageAxis.confirm(confirmTip, onOk, 'Delete Confirm');
    else onOk();
  }

  receivedeleteEntityData(data, props, action) {
    const { pageAxis, property } = props;

    if (this.isSuccessNextsProps(data, pageAxis.alert)) {
      this.alert(action.successTip, pageAxis.showMessage)
      //刷新查询
      property.refresh();
    }
    return false;
  }

  selectRowToPage(props, action) {
    const { pageAxis, entityData } = props;
    const { pageUrl, isSelfOperation, selfPropertyName } = action;

    let url = pageUrl
    url = Common.replaceDataContent(entityData, url, true);

    if (isSelfOperation && pageAxis.loginUserId !== entityData[selfPropertyName]) {
      url = Common.addUrlParams(url, 'isEdit', false);
    }

    pageAxis.toPage(url)
  }
}
