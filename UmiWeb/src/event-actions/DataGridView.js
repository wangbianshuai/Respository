import BaseIndex from "./BaseIndex";
import { Common } from "UtilsCommon";

export default class DataGridView extends BaseIndex {

    SearchQuery(props, action) {
        if (!action.Parameters) this.InitSearchQueryAction(props, action);

        action.IsSearch = props.Property.Type !== "DataGridView";
        this.SearchData(action.Parameters, props.PageIndex || 1, props.PageSize || 10);
    }

    InitSearchQueryAction(props, action) {
        const { Property, EventActions } = props;
        //判断props.Property 是 查询按钮或搜索框 还是DataGridView
        const DataGridView = Property.Type === "DataGridView" ? Property : EventActions.GetComponent(action.DataGridView);
        const SearchButton = Property.Type === "DataGridView" ? EventActions.GetControl(action.SearchButton) : Property;
        const SearchView = EventActions.GetComponent(action.SearchView);
        const AlertMessage = EventActions.GetControl(action.AlertMessage);
        action.Parameters = { DataGridView, SearchButton, SearchView, AlertMessage }
    }

    SearchData(parameters, pageIndex, pageSize) {
        const { DataGridView, SearchButton } = parameters;
        const { ActionTypes, Invoke, EntitySearchQuery } = DataGridView;
        const { SearchQuery } = ActionTypes;

        const ConditionList = this.GetConditionList(parameters);
        if (ConditionList === false) return;

        DataGridView.SetDataLoading(true);
        SearchButton && SearchButton.SetDisabled(true);

        const data = { EntitySearchQuery, PageIndex: pageIndex, PageSize: pageSize, ConditionList }

        Invoke(SearchQuery, data);
    }

    ReceiveSearchQuery(data, props) {
        const { EventActions, Property } = props;
        const action = EventActions.GetAction(Property.EventActionName);
        const { SearchButton, AlertMessage } = action.Parameters;

        //设置提示信息
        let msg = ""
        if (data.IsSuccess === false) msg = data.Message;
        else if (action.IsSearch) msg = "符合当前查询条件的结果总计3条！";

        if (msg) AlertMessage.SetValue(msg);

        //设置搜索按钮
        SearchButton && SearchButton.SetDisabled(false);
    }

    GetConditionList(parameters) {
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

        const { DataGridView, AlertMessage } = action.Parameters;
        const { EventActions } = props;

        const selectDataList = DataGridView.GetSelectDataList();
        if (selectDataList.length === 0) {
            if (AlertMessage) AlertMessage.SetValue("请先选择数据行！")
            return;
        }

        const url = Common.ReplaceDataContent(selectDataList[0], action.PageUrl);
        if (action.IsOpenUrl) EventActions.OpenPage(url)
        else EventActions.ToPage(url)
    }

    SelectRowToPageAction(props, action) {
        const { EventActions } = props;
        const DataGridView = EventActions.GetComponent(action.DataGridView);
        const AlertMessage = EventActions.GetControl(action.AlertMessage);

        action.Parameters = { DataGridView, AlertMessage }
    }
}