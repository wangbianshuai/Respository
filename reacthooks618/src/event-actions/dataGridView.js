import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class dataGridView extends BaseIndex {

    searchQuery(props, action) {
        if (!action.Parameters) this.initSearchQueryAction(props, action);

        else action.isSearch = props.property.type !== "dataGridView";
        this.SearchData(props, action.Parameters, props.pageIndex || 1, props.pageSize || 10, action.isClearQuery);
    }

    initSearchQueryAction(props, action) {
        const { property, pageAxis } = props;
        //判断props.property 是 查询按钮或搜索框 还是DataGridView
        const dataGridView = property.type === "dataGridView" ? property : pageAxis.getComponent(action.dataGridView);
        const SearchButton = property.type === "dataGridView" ? pageAxis.getControl(action.SearchButton) : property;
        const SearchView = pageAxis.getComponent(action.SearchView);
        const AlertMessage = pageAxis.getControl(action.AlertMessage);
        const expandSearchQueryLoad = pageAxis.getFunction(action.expandSearchQueryLoad)
        action.Parameters = { dataGridView, SearchButton, SearchView, AlertMessage, expandSearchQueryLoad }
    }

    SearchData(props, parameters, pageIndex, pageSize, isClearQuery) {
        const { dataGridView, SearchButton } = parameters;
        const { actionTypes, Invoke, EntitySearchQuery } = dataGridView;
        const { searchQuery } = actionTypes;
        const { pageAxis, isData } = props;

        const ConditionList = this.getConditionList(parameters, isClearQuery);
        if (ConditionList === false) return;

        const queryInfo = this.getQueryInfo(dataGridView);
        queryInfo.WhereFields = ConditionList;

        dataGridView.SearchButton = SearchButton;
        dataGridView.setDataLoading(true);
        dataGridView.QueryInfo = queryInfo;
        dataGridView.pageSize = pageSize;
        SearchButton && SearchButton.setDisabled(true);

        const data = { EntitySearchQuery, entity: dataGridView.entity, isData, pageIndex: pageIndex, pageSize: pageSize, QueryInfo: queryInfo, pageData: pageAxis.pageData }

        Invoke(searchQuery, data);
    }

    receiveSearchQuery(data, props) {
        const { pageAxis, property, isData } = props;
        const action = pageAxis.getAction(property.eventActionName);
        if (!action.Parameters) this.initSearchQueryAction(props, action);
        const { AlertMessage, expandSearchQueryLoad } = action.Parameters;

        const SearchButton = property.SearchButton || action.Parameters.SearchButton;

        let pageRecord = data.pageRecord || 0;
        if (data.pageInfo) pageRecord = data.pageInfo.pageRecord;

        //设置提示信息
        let msg = ""
        if (data.isSuccess === false) {
            msg = data.message;
            if (!AlertMessage) this.Alert(msg, pageAxis.ShowMessage);
        }
        else if ((action.isSearch || !action.isQuery) && !isData) msg = `符合当前查询条件的结果总计${pageRecord}条！`;

        action.isQuery = true;

        if (msg && AlertMessage) AlertMessage.setValue(msg);

        //设置搜索按钮
        SearchButton && SearchButton.setDisabled(false);

        if (expandSearchQueryLoad) expandSearchQueryLoad({ data, props })
    }

    getConditionList(parameters, isClearQuery) {
        const { SearchView } = parameters;
        if (!SearchView) return {};

        const conditionList = [];
        SearchView.properties.forEach(p => {
            const name = p.propertyName || p.name;
            if (p.isCondition && p.getValue) conditionList.push({ name: name, label: p.label, OperateLogic: p.OperateLogic || "=", DataType: p.DataType || "string", value: this.getPropertyValues(p, isClearQuery) });
        });

        if (Common.isArray(SearchView.DefaultConditions)) {
            SearchView.DefaultConditions.forEach(p => {
                var condition = {
                    name: p.name,
                    label: p.label,
                    OperateLogic: p.OperateLogic || "=",
                    DataType: p.DataType || "string",
                    value: p.defaultValue
                }
                if (p.isCurrentUser) condition.value = Common.getStorage("LoginUserId");

                if (!Common.isNullOrEmpty(condition.value)) conditionList.push(condition)
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
        const primaryKey = dataGridView.entity.primaryKey;
        var property = null, isGroupBy = false, hasPrimaryKey = false, name = "";
        var queryInfo = {}, orderByList = [], groupByFieldList = [], groupByList = [], selectFieldList = [];
        var firstFieldOrderBy = "";
        for (var i = 0; i < dataGridView.properties.length; i++) {
            property = dataGridView.properties[i];
            if (dataGridView.isGroupByQuery && property.isVisible === false) continue;

            name = property.propertyName || property.name;
            if (name === primaryKey) hasPrimaryKey = true;
            if (Common.isNullOrEmpty(property.GroupByExpression)) {
                selectFieldList.push(name);
                if (!Common.isNullOrEmpty(property.OrderByType)) {
                    orderByList.push(name + " " + property.OrderByType);
                }
                groupByList.push(name);

                if (!firstFieldOrderBy) firstFieldOrderBy = name + (property.OrderByType || " desc");
            }
            else {
                isGroupBy = true;
                groupByFieldList.push(property.GroupByExpression + " as " + name);
                if (!Common.isNullOrEmpty(property.OrderByType)) {
                    orderByList.push(property.GroupByExpression + " " + property.OrderByType);
                }

                if (!firstFieldOrderBy) firstFieldOrderBy = property.GroupByExpression + (property.OrderByType || " desc");
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
        const { SearchView } = parameters;
        if (!SearchView) return {};

        const condition = {};
        SearchView.properties.forEach(p => {
            const name = p.propertyName || p.name;
            if (p.isCondition && p.getValue) condition[name] = p.getValue();
        });

        return condition;
    }

    setOrderBy() {

    }

    SelectRowToPage(props, action) {
        if (!action.Parameters) this.SelectRowToPageAction(props, action);

        const { dataGridView, AlertMessage, setPageUrl } = action.Parameters;
        const { pageAxis, property } = props;

        var data = null;
        if (property.Params) data = property.Params;
        else {
            const selectDataList = dataGridView.getSelectDataList();
            if (selectDataList.length === 0) {
                this.Alert("请选择记录再操作！", pageAxis.ShowMessage, AlertMessage)
                return;
            }

            if (selectDataList.length > 0 && AlertMessage) AlertMessage.setValue("")

            data = selectDataList[0];
        }

        if (action.isLocalData) {
            const editData = {};
            editData[dataGridView.entity.name] = data;
            Common.setStorage("EditEntityData", JSON.stringify(editData));
        }

        let url = ""
        if (setPageUrl) {
            url = setPageUrl({ data, props, action });
            if (url === false) return false;
        }
        else url = Common.replaceDataContent(data, action.pageUrl, true);

        const expandsetPageUrl = pageAxis.getFunction(action.expandsetPageUrl);
        if (expandsetPageUrl) url = expandsetPageUrl(url);

        if (action.isOpenUrl) pageAxis.OpenPage(url)
        else pageAxis.ToPage(url)
    }

    AlertByRowData(props, action) {
        if (!action.Parameters) this.AlertByRowDataAction(props, action);

        const { dataGridView, AlertMessage } = action.Parameters;
        const { pageAxis } = props;

        const selectDataList = dataGridView.getSelectDataList();
        if (selectDataList.length === 0) {
            this.Alert("请选择记录再操作！", pageAxis.ShowMessage, AlertMessage)
            return;
        }

        const data = selectDataList[0];

        const { StatusName, StatusValue, nullTipMessage } = action;
        if (StatusName && StatusValue) {
            if (!Common.isEquals(data[StatusName], StatusValue)) {
                pageAxis.Alert(nullTipMessage);
                return;
            }
        }

        const msg = Common.replaceDataContent(data, action.TipMessage);
        pageAxis.Alert(msg, action.title)
    }

    SelectRowToPageAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getComponent(action.dataGridView);
        const AlertMessage = pageAxis.getControl(action.AlertMessage);
        const setPageUrl = pageAxis.getFunction(action.setPageUrl);

        action.Parameters = { dataGridView, AlertMessage, setPageUrl }
    }

    AlertByRowDataAction(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getComponent(action.dataGridView);
        const AlertMessage = pageAxis.getControl(action.AlertMessage);

        action.Parameters = { dataGridView, AlertMessage }
    }

    ExcelExport(props, action) {
        if (!action.Parameters) this.InitExcelExportActoin(props, action);

        const { dataGridView } = action.Parameters;
        const { pageAxis } = props;

        if (dataGridView.getPageRecord() > 30000) { pageAxis.Alert("对不起，您要导出的数据量超过3万条，请先进行相应的数据筛选！"); return; }

        pageAxis.Confirm("确定将数据Excel导出吗？", () => this.ExecExcelExport(props, action));
    }

    ExecExcelExport(props, action) {
        const { dataGridView, expandsetExcelExportQueryInfo } = action.Parameters;
        const { pageAxis, property } = props;

        const { actionTypes, Invoke, EntityExcelExport } = dataGridView;
        const { ExcelExport } = actionTypes;

        const title = dataGridView.title || dataGridView.entity.name;

        const properties = dataGridView.getExcelExportProperties();
        var headerList = [];
        var header = {}, p = null;
        for (var i = 0; i < properties.length; i++) {
            p = properties[i];
            if (p.isData !== false) {
                header = {};
                header.label = p.label;
                header.name = p.name;
                header.Width = p.columnWidth || 0;
                headerList.push(header);
            }
        }

        let queryInfo = Common.clone(dataGridView.QueryInfo);
        queryInfo.HeaderInfos = headerList;

        if (expandsetExcelExportQueryInfo) queryInfo = expandsetExcelExportQueryInfo(queryInfo);
        if (queryInfo === false) return;

        property && property.setDisabled(true);
        dataGridView.ExcelExportButton = property;

        const data = { EntityExcelExport, title, entity: dataGridView.entity, pageIndex: 1, pageSize: dataGridView.pageSize, QueryInfo: queryInfo, pageData: pageAxis.pageData }

        Invoke(ExcelExport, data);
    }

    InitExcelExportActoin(props, action) {
        const { pageAxis } = props;
        const dataGridView = pageAxis.getComponent(action.dataGridView);

        const expandsetExcelExportQueryInfo = pageAxis.getFunction(action.expandsetExcelExportQueryInfo);

        action.Parameters = { dataGridView, expandsetExcelExportQueryInfo }
    }

    receiveExcelExport(data, props) {
        const { pageAxis, property } = props;

        //设置导出按钮
        property.ExcelExportButton.setDisabled(false);

        if (data.isSuccess === false || !data.fileName) {
            this.Alert(data.message || "导出失败！", pageAxis.ShowMessage);
            return;
        }

        this.DownLoad(property.ExcelExportButton.title, data.fileName)
    }

    DownLoad(title, fileName) {
        title += "_" + Common.createGuid().substr(0, 8).toUpperCase();
        var url = window.routerBase + `download/${title}.xlsx?fn=${fileName}`;
        window.open(url, "_self");
    }
}