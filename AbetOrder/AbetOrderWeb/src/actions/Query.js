import * as Common from "../utils/Common"
import Index from "./Index"

export default class Query extends Index {
    constructor(options) {
        super(options)

        this.Name = "Query";
    }

    PropsChanged(props, nextProps) {
        this.ReceiveQueryData(props, nextProps);
    }

    ReceiveQueryData(props, nextProps) {
        if (this.Page.JudgeChanged(nextProps, "DataList") || this.Page.JudgeChanged(nextProps, "PageInfo")) {
            if (nextProps.DataList !== undefined && nextProps.PageInfo !== undefined) {
                const { PageConfig: { SearchView } } = props;
                if (SearchView) {
                    const p = SearchView.Properties.filter(f => f.Name === "SearchAction")[0]
                    if (p && p.SetDisabled) p.SetDisabled(false);

                    if (SearchView.SetDataLoading) SearchView.SetDataLoading(false);
                }
            }
        }
    }

    SearchData(p, blQueryPage) {
        const { PageConfig } = this.Page.props
        const { SelectNames } = PageConfig

        //禁用查询按钮
        if (p && p.SetDisabled) p.SetDisabled(true);

        if (blQueryPage === undefined) PageConfig.PageIndex = 1;
        blQueryPage = blQueryPage === undefined ? true : blQueryPage

        const queryInfo = {};

        queryInfo.FieldSql = SelectNames.join(",");
        queryInfo.OrderBySql = this.GetOrderByList().join(",");
        queryInfo.GroupBySql = "";
        queryInfo.GroupByFieldSql = "";
        queryInfo.WhereFields = this.GetConditionList();

        this.QueryInfo = queryInfo;

        this.QueryPage(blQueryPage);

        const action = this.Page.GetAction("QueryData");
        action && this.FatchData(action, false);

        const { SearchView } = PageConfig;
        if (SearchView.SetDataLoading) SearchView.SetDataLoading(true)
    }

    PageIndexChange(pageIndex, pageSize) {
        const { PageConfig } = this.Page.props
        const { SearchView } = PageConfig;

        const blQueryPage = PageConfig.PageSize !== pageSize;
        if (blQueryPage) PageConfig.PageSize = pageSize;

        PageConfig.PageIndex = pageIndex;

        const p = Common.ArrayFirst(SearchView.Properties, (f) => f.Name === "SearchAction");

        this.SearchData(p, blQueryPage);
    }

    QueryPage(blQueryPage) {
        const action = this.Page.GetAction("QueryPage");
        if (blQueryPage) {
            window.setTimeout(() => {
                action && this.FatchData(action, true);
            }, 100);
        }
        else {
            const { PageInfo, PageConfig } = this.Page.props;
            action && this.Page.SetActionState(action, { ...PageInfo, PageIndex: PageConfig.PageIndex, PageSize: PageConfig.PageSize })
        }
    }

    GetConditionList() {
        const { PageConfig } = this.Page.props
        const { SearchView } = PageConfig;

        const conditionList = [];
        let condition = null;

        const list = SearchView.Properties.filter(f => f.IsSearch);
        list.forEach(p => {
            condition = {
                Name: p.PropertyName || p.Name,
                Label: p.Label,
                OperateLogic: p.OperateLogic || "=",
                DataType: p.DataType || "string",
                Text: p.GetText === undefined ? p.Label : p.GetText(),
                Value: p.GetValue === undefined ? "" : p.GetValue()
            }
            if (!Common.IsNullOrEmpty(condition.Value)) conditionList.push(condition)
        });

        if (Common.IsArray(PageConfig.DefaultConditions)) {
            PageConfig.DefaultConditions.forEach(p => {
                condition = {
                    Name: p.Name,
                    Label: p.Label,
                    OperateLogic: p.OperateLogic || "=",
                    DataType: p.DataType || "string",
                    Value: p.DefaultValue
                }
                if (p.IsCurrentUser) condition.Value = this.Page.LoginUser.UserId;

                if (!Common.IsNullOrEmpty(condition.Value)) conditionList.push(condition)
            });
        }

        return conditionList;
    }

    GetOrderByList() {
        const { PageConfig: { OrderByList } } = this.Page.props
        if (Common.IsArray(OrderByList)) return OrderByList.map(m => m.Name + (m.IsDesc ? " desc" : ""))

        return [];
    }

    FatchData(action, isPageQuery) {
        const { PageConfig } = this.Page.props
        const { IsPaging, PageSize, PageIndex } = PageConfig

        let url = "View" + PageConfig.EntityName;
        if (PageConfig.QueryUrl) url = PageConfig.QueryUrl;

        if (!Common.IsNullOrEmpty(url)) {
            url += url.indexOf("?") > 0 ? "&$query=true" : "?$query=true";
            if (IsPaging) {
                url += "&pageindex=" + PageIndex.toString() + "&pagesize=" + PageSize;
                if (isPageQuery) url += "&$page=true";
                else url += "&$data=true";
            }
        }

        if (!isPageQuery && PageConfig.IsGroupByInfo) url = Common.AddUrlParams(url, "$groupbyinfo", "true");

        this.Page.SetActionState(action);
        this.Page.Dispatch(action, { Url: url, QueryInfo: this.QueryInfo })
    }

    Refresh(type) {
        const { PageConfig } = this.Page.props
        const { SearchView } = PageConfig
        const { PageInfo } = this.Page.props;

        let blQueryPage = false;
        if (type === "Insert") { this.ClearConditions(); PageConfig.PageIndex = 1; blQueryPage = true; }
        else if (type === "Delete") {
            blQueryPage = true;
            if (PageInfo && PageInfo.PageRecord % PageInfo.PageSize === 1 && PageInfo.PageIndex > 1) {
                PageConfig.PageIndex -= 1;
            }
        }

        const p = Common.ArrayFirst(SearchView.Properties, (f) => f.Name === "SearchAction");

        window.setTimeout(() => this.SearchData(p, blQueryPage), 100);
    }

    ClearConditions() {
        const { PageConfig: { SearchView } } = this.Page.props

        SearchView.Properties.forEach(p => p.SetValue && p.SetValue(p.IsQueryDefault ? p.DefaultValue : null));
    }
}