import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class DataGridView extends BaseIndex {

    SearchQuery(props, action) {
        if (!action.Parameters) this.InitSearchQueryAction(props, action);

        else action.isSearch = props.property.type !== "DataGridView";
        this.SearchData(props, action.Parameters, props.PageIndex || 1, props.PageSize || 10, action.isClearQuery);
    }

    InitSearchQueryAction(props, action) {
        const { property, pageAxis } = props;
        //判断props.property 是 查询按钮或搜索框 还是DataGridView
        const DataGridView = property.type === "DataGridView" ? property : pageAxis.getComponent(action.DataGridView);
        const SearchButton = property.type === "DataGridView" ? pageAxis.getControl(action.SearchButton) : property;
        const SearchView = pageAxis.getComponent(action.SearchView);
        const AlertMessage = pageAxis.getControl(action.AlertMessage);
        const expandSearchQueryLoad = pageAxis.getFunction(action.expandSearchQueryLoad)
        action.Parameters = { DataGridView, SearchButton, SearchView, AlertMessage, expandSearchQueryLoad }
    }

    SearchData(props, parameters, pageIndex, pageSize, isClearQuery) {
        const { DataGridView, SearchButton } = parameters;
        const { ActionTypes, Invoke, EntitySearchQuery } = DataGridView;
        const { SearchQuery } = ActionTypes;
        const { pageAxis, isData } = props;

        const ConditionList = this.getConditionList(parameters, isClearQuery);
        if (ConditionList === false) return;

        const queryInfo = this.getQueryInfo(DataGridView);
        queryInfo.WhereFields = ConditionList;

        DataGridView.SearchButton = SearchButton;
        DataGridView.setDataLoading(true);
        DataGridView.QueryInfo = queryInfo;
        DataGridView.PageSize = pageSize;
        SearchButton && SearchButton.setDisabled(true);

        const data = { EntitySearchQuery, Entity: DataGridView.Entity, isData, PageIndex: pageIndex, PageSize: pageSize, QueryInfo: queryInfo, PageData: pageAxis.PageData }

        Invoke(SearchQuery, data);
    }

    ReceiveSearchQuery(data, props) {
        const { pageAxis, property, isData } = props;
        const action = pageAxis.getAction(property.EventActionName);
        if (!action.Parameters) this.InitSearchQueryAction(props, action);
        const { AlertMessage, expandSearchQueryLoad } = action.Parameters;

        const SearchButton = property.SearchButton || action.Parameters.SearchButton;

        let pageRecord = data.PageRecord || 0;
        if (data.PageInfo) pageRecord = data.PageInfo.PageRecord;

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
        SearchView.Properties.forEach(p => {
            const name = p.propertyName || p.name;
            if (p.isCondition && p.getValue) conditionList.push({ name: name, label: p.label, OperateLogic: p.OperateLogic || "=", DataType: p.DataType || "string", Value: this.getPropertyValues(p, isClearQuery) });
        });

        if (Common.isArray(SearchView.DefaultConditions)) {
            SearchView.DefaultConditions.forEach(p => {
                var condition = {
                    name: p.name,
                    label: p.label,
                    OperateLogic: p.OperateLogic || "=",
                    DataType: p.DataType || "string",
                    Value: p.DefaultValue
                }
                if (p.isCurrentUser) condition.Value = Common.getStorage("LoginUserId");

                if (!Common.isNullOrEmpty(condition.Value)) conditionList.push(condition)
            });
        }
        return conditionList;
    }

    getPropertyValues(p, isClearQuery) {
        if (isClearQuery) {
            p.setValue(p.DefaultValue);
            return p.DefaultValue;
        }
        return p.getValue();
    }

    getQueryInfo(dataGridView) {
        const primaryKey = dataGridView.Entity.PropertyPrimaryKey || dataGridView.Entity.PrimaryKey;
        var property = null, isGroupBy = false, hasPrimaryKey = false, name = "";
        var queryInfo = {}, orderByList = [], groupByFieldList = [], groupByList = [], selectFieldList = [];
        var firstFieldOrderBy = "";
        for (var i = 0; i < dataGridView.Properties.length; i++) {
            property = dataGridView.Properties[i];
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
        SearchView.Properties.forEach(p => {
            const name = p.propertyName || p.name;
            if (p.isCondition && p.getValue) condition[name] = p.getValue();
        });

        return condition;
    }

    setOrderBy() {

    }

    SelectRowToPage(props, action) {
        if (!action.Parameters) this.SelectRowToPageAction(props, action);

        const { DataGridView, AlertMessage, setPageUrl } = action.Parameters;
        const { pageAxis, property } = props;

        var data = null;
        if (property.Params) data = property.Params;
        else {
            const selectDataList = DataGridView.getSelectDataList();
            if (selectDataList.length === 0) {
                this.Alert("请选择记录再操作！", pageAxis.ShowMessage, AlertMessage)
                return;
            }

            if (selectDataList.length > 0 && AlertMessage) AlertMessage.setValue("")

            data = selectDataList[0];
        }

        if (action.isLocalData) {
            const editData = {};
            editData[DataGridView.Entity.name] = data;
            Common.setStorage("EditEntityData", JSON.stringify(editData));
        }

        let url = ""
        if (setPageUrl) {
            url = setPageUrl({ data, props, action });
            if (url === false) return false;
        }
        else url = Common.replaceDataContent(data, action.PageUrl, true);

        const expandsetPageUrl = pageAxis.getFunction(action.expandsetPageUrl);
        if (expandsetPageUrl) url = expandsetPageUrl(url);

        if (action.isOpenUrl) pageAxis.OpenPage(url)
        else pageAxis.ToPage(url)
    }

    AlertByRowData(props, action) {
        if (!action.Parameters) this.AlertByRowDataAction(props, action);

        const { DataGridView, AlertMessage } = action.Parameters;
        const { pageAxis } = props;

        const selectDataList = DataGridView.getSelectDataList();
        if (selectDataList.length === 0) {
            this.Alert("请选择记录再操作！", pageAxis.ShowMessage, AlertMessage)
            return;
        }

        const data = selectDataList[0];

        const { StatusName, StatusValue, NullTipMessage } = action;
        if (StatusName && StatusValue) {
            if (!Common.isEquals(data[StatusName], StatusValue)) {
                pageAxis.Alert(NullTipMessage);
                return;
            }
        }

        const msg = Common.replaceDataContent(data, action.TipMessage);
        pageAxis.Alert(msg, action.Title)
    }

    SelectRowToPageAction(props, action) {
        const { pageAxis } = props;
        const DataGridView = pageAxis.getComponent(action.DataGridView);
        const AlertMessage = pageAxis.getControl(action.AlertMessage);
        const setPageUrl = pageAxis.getFunction(action.setPageUrl);

        action.Parameters = { DataGridView, AlertMessage, setPageUrl }
    }

    AlertByRowDataAction(props, action) {
        const { pageAxis } = props;
        const DataGridView = pageAxis.getComponent(action.DataGridView);
        const AlertMessage = pageAxis.getControl(action.AlertMessage);

        action.Parameters = { DataGridView, AlertMessage }
    }

    ExcelExport(props, action) {
        if (!action.Parameters) this.InitExcelExportActoin(props, action);

        const { DataGridView } = action.Parameters;
        const { pageAxis } = props;

        if (DataGridView.getPageRecord() > 30000) { pageAxis.Alert("对不起，您要导出的数据量超过3万条，请先进行相应的数据筛选！"); return; }

        pageAxis.Confirm("确定将数据Excel导出吗？", () => this.ExecExcelExport(props, action));
    }

    ExecExcelExport(props, action) {
        const { DataGridView, expandsetExcelExportQueryInfo } = action.Parameters;
        const { pageAxis, property } = props;

        const { ActionTypes, Invoke, EntityExcelExport } = DataGridView;
        const { ExcelExport } = ActionTypes;

        const Title = DataGridView.Title || DataGridView.Entity.name;

        const properties = DataGridView.getExcelExportProperties();
        var headerList = [];
        var header = {}, p = null;
        for (var i = 0; i < properties.length; i++) {
            p = properties[i];
            if (p.isData !== false) {
                header = {};
                header.label = p.label;
                header.name = p.name;
                header.Width = p.ColumnWidth || 0;
                headerList.push(header);
            }
        }

        let queryInfo = Common.clone(DataGridView.QueryInfo);
        queryInfo.HeaderInfos = headerList;

        if (expandsetExcelExportQueryInfo) queryInfo = expandsetExcelExportQueryInfo(queryInfo);
        if (queryInfo === false) return;

        property && property.setDisabled(true);
        DataGridView.ExcelExportButton = property;

        const data = { EntityExcelExport, Title, Entity: DataGridView.Entity, PageIndex: 1, PageSize: DataGridView.PageSize, QueryInfo: queryInfo, PageData: pageAxis.PageData }

        Invoke(ExcelExport, data);
    }

    InitExcelExportActoin(props, action) {
        const { pageAxis } = props;
        const DataGridView = pageAxis.getComponent(action.DataGridView);

        const expandsetExcelExportQueryInfo = pageAxis.getFunction(action.expandsetExcelExportQueryInfo);

        action.Parameters = { DataGridView, expandsetExcelExportQueryInfo }
    }

    ReceiveExcelExport(data, props) {
        const { pageAxis, property } = props;

        //设置导出按钮
        property.ExcelExportButton.setDisabled(false);

        if (data.isSuccess === false || !data.fileName) {
            this.Alert(data.message || "导出失败！", pageAxis.ShowMessage);
            return;
        }

        this.DownLoad(property.ExcelExportButton.Title, data.fileName)
    }

    DownLoad(title, fileName) {
        title += "_" + Common.createGuid().substr(0, 8).toUpperCase();
        var url = window.routerBase + `download/${title}.xlsx?fn=${fileName}`;
        window.open(url, "_self");
    }
}