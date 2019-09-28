import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

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
        if (data.IsSuccess === false) msg = data.Message;
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
        for (var i = 0; i < dataGridView.Properties.length; i++) {
            property = dataGridView.Properties[i];
            name = property.PropertyName || property.Name;
            if (name === primaryKey) hasPrimaryKey = true;
            if (Common.IsNullOrEmpty(property.GroupByExpression)) {
                selectFieldList.push(name);
                if (!Common.IsNullOrEmpty(property.OrderByType)) {
                    orderByList.push(name + " " + property.OrderByType);
                }
                groupByList.push(name);
            }
            else {
                isGroupBy = true;
                groupByFieldList.push(property.GroupByExpression + " as " + name);
                if (!Common.IsNullOrEmpty(property.OrderByType)) {
                    orderByList.push(name + " " + property.OrderByType);
                }
            }
        }
        if (!hasPrimaryKey) selectFieldList.splice(0, 0, primaryKey);

        if (!isGroupBy) groupByList = [];

        queryInfo.HasLabel = selectFieldList.length === 0;
        queryInfo.FieldSql = selectFieldList.join(",");
        queryInfo.OrderBySql = orderByList.join(",");
        queryInfo.GroupBySql = groupByList.join(",");
        queryInfo.GroupByFieldSql = groupByFieldList.join(",");
        queryInfo.WhereFields = selectFieldList.join("");

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
        const { EventActions } = props;

        const selectDataList = DataGridView.GetSelectDataList();
        if (selectDataList.length === 0) {
            if (AlertMessage) AlertMessage.SetValue("请选择记录再操作！")
            return;
        }

        if (selectDataList.length > 0 && AlertMessage) AlertMessage.SetValue("")

        const data = selectDataList[0];

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
        if (action.IsOpenUrl) EventActions.OpenPage(url)
        else EventActions.ToPage(url)
    }

    AlertByRowData(props, action) {
        if (!action.Parameters) this.AlertByRowDataAction(props, action);

        const { DataGridView, AlertMessage } = action.Parameters;
        const { EventActions } = props;

        const selectDataList = DataGridView.GetSelectDataList();
        if (selectDataList.length === 0) {
            if (AlertMessage) AlertMessage.SetValue("请选择记录再操作！")
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
}