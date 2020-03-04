import BaseIndex from "./BaseIndex";
import { Common, EnvConfig } from "UtilsCommon";

export default class DataGridView extends BaseIndex {

    SearchQuery(props, action) {
        if (!action.Parameters) this.InitSearchQueryAction(props, action);

        else action.IsSearch = props.Property.Type !== "DataGridView";
        this.SearchData(props, action.Parameters, props.PageIndex || 1, props.PageSize || 10, action.IsClearQuery);
    }

    InitSearchQueryAction(props, action) {
        const { Property, EventActions } = props;
        //判断props.Property 是 查询按钮或搜索框 还是DataGridView
        const DataGridView = Property.Type === "DataGridView" ? Property : EventActions.GetComponent(action.DataGridView);
        const SearchButton = Property.Type === "DataGridView" ? EventActions.GetControl(action.SearchButton) : Property;
        const SearchView = EventActions.GetComponent(action.SearchView);
        const AlertMessage = EventActions.GetControl(action.AlertMessage);
        const ExpandSearchQueryLoad = EventActions.GetFunction(action.ExpandSearchQueryLoad)
        action.Parameters = { DataGridView, SearchButton, SearchView, AlertMessage, ExpandSearchQueryLoad }
    }

    SearchData(props, parameters, pageIndex, pageSize, isClearQuery) {
        const { DataGridView, SearchButton } = parameters;
        const { ActionTypes, Invoke, EntitySearchQuery } = DataGridView;
        const { SearchQuery } = ActionTypes;
        const { EventActions, IsData } = props;

        const ConditionList = this.GetConditionList(parameters, isClearQuery);
        if (ConditionList === false) return;

        const queryInfo = this.GetQueryInfo(DataGridView);
        queryInfo.WhereFields = ConditionList;

        DataGridView.SearchButton = SearchButton;
        DataGridView.SetDataLoading(true);
        DataGridView.QueryInfo = queryInfo;
        DataGridView.PageSize = pageSize;
        SearchButton && SearchButton.SetDisabled(true);

        const data = { EntitySearchQuery, Entity: DataGridView.Entity, IsData, PageIndex: pageIndex, PageSize: pageSize, QueryInfo: queryInfo, PageData: EventActions.PageData }

        Invoke(SearchQuery, data);
    }

    ReceiveSearchQuery(data, props) {
        const { EventActions, Property, IsData } = props;
        const action = EventActions.GetAction(Property.EventActionName);
        if (!action.Parameters) this.InitSearchQueryAction(props, action);
        const { AlertMessage, ExpandSearchQueryLoad } = action.Parameters;

        const SearchButton = Property.SearchButton || action.Parameters.SearchButton;

        let pageRecord = data.PageRecord || 0;
        if (data.PageInfo) pageRecord = data.PageInfo.PageRecord;

        //设置提示信息
        let msg = ""
        if (data.IsSuccess === false) {
            msg = data.Message;
            if (!AlertMessage) this.Alert(msg, EventActions.ShowMessage);
        }
        else if ((action.IsSearch || !action.IsQuery) && !IsData) msg = `符合当前查询条件的结果总计${pageRecord}条！`;

        action.IsQuery = true;

        if (msg && AlertMessage) AlertMessage.SetValue(msg);

        //设置搜索按钮
        SearchButton && SearchButton.SetDisabled(false);

        if (ExpandSearchQueryLoad) ExpandSearchQueryLoad({ data, props })
    }

    GetConditionList(parameters, isClearQuery) {
        const { SearchView } = parameters;
        if (!SearchView) return {};

        const conditionList = [];
        SearchView.Properties.forEach(p => {
            const name = p.PropertyName || p.Name;
            if (p.IsCondition && p.GetValue) conditionList.push({ Name: name, Label: p.Label, OperateLogic: p.OperateLogic || "=", DataType: p.DataType || "string", Value: this.GetPropertyValues(p, isClearQuery) });
        });

        if (Common.IsArray(SearchView.DefaultConditions)) {
            SearchView.DefaultConditions.forEach(p => {
                var condition = {
                    Name: p.Name,
                    Label: p.Label,
                    OperateLogic: p.OperateLogic || "=",
                    DataType: p.DataType || "string",
                    Value: p.DefaultValue
                }
                if (p.IsCurrentUser) condition.Value = Common.GetStorage("LoginUserId");

                if (!Common.IsNullOrEmpty(condition.Value)) conditionList.push(condition)
            });
        }
        return conditionList;
    }

    GetPropertyValues(p, isClearQuery) {
        if (isClearQuery) {
            p.SetValue(p.DefaultValue);
            return p.DefaultValue;
        }
        return p.GetValue();
    }

    GetQueryInfo(dataGridView) {
        const primaryKey = dataGridView.Entity.PropertyPrimaryKey || dataGridView.Entity.PrimaryKey;
        var property = null, isGroupBy = false, hasPrimaryKey = false, name = "";
        var queryInfo = {}, orderByList = [], groupByFieldList = [], groupByList = [], selectFieldList = [];
        var firstFieldOrderBy = "";
        for (var i = 0; i < dataGridView.Properties.length; i++) {
            property = dataGridView.Properties[i];
            if (dataGridView.IsGroupByQuery && property.IsVisible === false) continue;

            name = property.PropertyName || property.Name;
            if (name === primaryKey) hasPrimaryKey = true;
            if (Common.IsNullOrEmpty(property.GroupByExpression)) {
                selectFieldList.push(name);
                if (!Common.IsNullOrEmpty(property.OrderByType)) {
                    orderByList.push(name + " " + property.OrderByType);
                }
                groupByList.push(name);

                if (!firstFieldOrderBy) firstFieldOrderBy = name + (property.OrderByType || " desc");
            }
            else {
                isGroupBy = true;
                groupByFieldList.push(property.GroupByExpression + " as " + name);
                if (!Common.IsNullOrEmpty(property.OrderByType)) {
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

    GetConditions(parameters) {
        const { SearchView } = parameters;
        if (!SearchView) return {};

        const condition = {};
        SearchView.Properties.forEach(p => {
            const name = p.PropertyName || p.Name;
            if (p.IsCondition && p.GetValue) condition[name] = p.GetValue();
        });

        return condition;
    }

    SetOrderBy() {

    }

    SelectRowToPage(props, action) {
        if (!action.Parameters) this.SelectRowToPageAction(props, action);

        const { DataGridView, AlertMessage, SetPageUrl } = action.Parameters;
        const { EventActions, Property } = props;

        var data = null;
        if (Property.Params) data = Property.Params;
        else {
            const selectDataList = DataGridView.GetSelectDataList();
            if (selectDataList.length === 0) {
                this.Alert("请选择记录再操作！", EventActions.ShowMessage, AlertMessage)
                return;
            }

            if (selectDataList.length > 0 && AlertMessage) AlertMessage.SetValue("")

            data = selectDataList[0];
        }

        if (action.IsLocalData) {
            const editData = {};
            editData[DataGridView.Entity.Name] = data;
            Common.SetStorage("EditEntityData", JSON.stringify(editData));
        }

        let url = ""
        if (SetPageUrl) {
            url = SetPageUrl({ data, props, action });
            if (url === false) return false;
        }
        else url = Common.ReplaceDataContent(data, action.PageUrl, true);

        const ExpandSetPageUrl = EventActions.GetFunction(action.ExpandSetPageUrl);
        if (ExpandSetPageUrl) url = ExpandSetPageUrl(url);

        if (action.IsOpenUrl) EventActions.OpenPage(url)
        else EventActions.ToPage(url)
    }

    AlertByRowData(props, action) {
        if (!action.Parameters) this.AlertByRowDataAction(props, action);

        const { DataGridView, AlertMessage } = action.Parameters;
        const { EventActions } = props;

        const selectDataList = DataGridView.GetSelectDataList();
        if (selectDataList.length === 0) {
            this.Alert("请选择记录再操作！", EventActions.ShowMessage, AlertMessage)
            return;
        }

        const data = selectDataList[0];

        const { StatusName, StatusValue, NullTipMessage } = action;
        if (StatusName && StatusValue) {
            if (!Common.IsEquals(data[StatusName], StatusValue)) {
                EventActions.Alert(NullTipMessage);
                return;
            }
        }

        const msg = Common.ReplaceDataContent(data, action.TipMessage);
        EventActions.Alert(msg, action.Title)
    }

    SelectRowToPageAction(props, action) {
        const { EventActions } = props;
        const DataGridView = EventActions.GetComponent(action.DataGridView);
        const AlertMessage = EventActions.GetControl(action.AlertMessage);
        const SetPageUrl = EventActions.GetFunction(action.SetPageUrl);

        action.Parameters = { DataGridView, AlertMessage, SetPageUrl }
    }

    AlertByRowDataAction(props, action) {
        const { EventActions } = props;
        const DataGridView = EventActions.GetComponent(action.DataGridView);
        const AlertMessage = EventActions.GetControl(action.AlertMessage);

        action.Parameters = { DataGridView, AlertMessage }
    }

    ExcelExport(props, action) {
        if (!action.Parameters) this.InitExcelExportActoin(props, action);

        const { DataGridView } = action.Parameters;
        const { EventActions } = props;

        if (DataGridView.GetPageRecord() > 30000) { EventActions.Alert("对不起，您要导出的数据量超过3万条，请先进行相应的数据筛选！"); return; }

        EventActions.Confirm("确定将数据Excel导出吗？", () => this.ExecExcelExport(props, action));
    }

    ExecExcelExport(props, action) {
        const { DataGridView, ExpandSetExcelExportQueryInfo } = action.Parameters;
        const { EventActions, Property } = props;

        const { ActionTypes, Invoke, EntityExcelExport } = DataGridView;
        const { ExcelExport } = ActionTypes;

        const Title = DataGridView.Title || DataGridView.Entity.Name;
        
        const properties = DataGridView.GetExcelExportProperties();
        var headerList = [];
        var header = {}, p = null;
        for (var i = 0; i < properties.length; i++) {
            p = properties[i];
            if (p.IsData !== false) {
                header = {};
                header.Label = p.Label;
                header.Name = p.Name;
                header.Width = p.ColumnWidth || 0;
                headerList.push(header);
            }
        }

        let queryInfo = Common.Clone(DataGridView.QueryInfo);
        queryInfo.HeaderInfos = headerList;

        if (ExpandSetExcelExportQueryInfo) queryInfo = ExpandSetExcelExportQueryInfo(queryInfo);
        if (queryInfo === false) return;

        Property && Property.SetDisabled(true);
        DataGridView.ExcelExportButton = Property;

        const data = { EntityExcelExport, Title, Entity: DataGridView.Entity, PageIndex: 1, PageSize: DataGridView.PageSize, QueryInfo: queryInfo, PageData: EventActions.PageData }

        Invoke(ExcelExport, data);
    }

    InitExcelExportActoin(props, action) {
        const { EventActions } = props;
        const DataGridView = EventActions.GetComponent(action.DataGridView);

        const ExpandSetExcelExportQueryInfo = EventActions.GetFunction(action.ExpandSetExcelExportQueryInfo);

        action.Parameters = { DataGridView, ExpandSetExcelExportQueryInfo }
    }

    ReceiveExcelExport(data, props) {
        const { EventActions, Property } = props;

        //设置搜索按钮
        Property.ExcelExportButton && Property.ExcelExportButton.SetDisabled(false);

        if (data.IsSuccess === false || !data.FileName) {
            this.Alert(data.Message || "导出失败！", EventActions.ShowMessage);
            return;
        }

        this.DownLoad(data.FileName)
    }

    DownLoad(fileName) {
        var host = "";
        if (EnvConfig.Env === "local") host = "http://localhost/wr/";
        var url = host + "/download.aspx?fn=" + fileName;
        window.open(url, "_self");
    }

}