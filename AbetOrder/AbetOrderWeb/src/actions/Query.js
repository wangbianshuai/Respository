import * as Common from "../utils/Common"
import Index from "./Index"

export default class Query extends Index {
    constructor(options) {
        super(options)

        this.Name = "Query";
    }

    PropsChanged(props, nextProps) {
        this.ReceiveQueryData(props, nextProps);
        this.ReceiveExcelExport(props, nextProps);
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

        if (this.Page.JudgeChanged(nextProps, "DataList")) {
            this.Page.EventActions.DataGrid.SetSelectedRowKey(this.SelectPrimaryKey);
            this.SelectPrimaryKey = "";
        }
    }

    ReceiveExcelExport(props, nextProps) {
        if (this.Page.JudgeChanged(nextProps, "ExcelExport")) {
            if (nextProps.ExcelExport !== undefined) {
                if (this.ExcelExportProperty && this.ExcelExportProperty.SetDisabled) this.ExcelExportProperty.SetDisabled(false);

                const { PageConfig } = props;

                if (nextProps.ExcelExport.FileName) {
                    const title = PageConfig.Title + "_" + Common.CreateGuid().substr(0, 8).toUpperCase();
                    const url = Common.DataApiUrl.replace("api/", "download/" + title + ".xlsx?fn=" + nextProps.ExcelExport.FileName);
                    window.open(url, "_self");
                }
            }
        }
    }

    ExcelExport(p, params) {
        this.ExcelExportProperty = p;

        if (this.Page.props.PageInfo.PageRecord > 20000) { this.Page.ShowMessage("对不起，您要导出的数据量超过两万条，请先进行相应的数据筛选！"); return; }

        this.Page.ShowConfirm("确认要Excel导出吗？", () => {
            if (p && p.SetDisabled) p.SetDisabled(true);

            const queryInfo = Object.assign({}, this.QueryInfo);
            queryInfo.HeaderInfos = this.GetHeaderInfoList();
            queryInfo.FieldSql = queryInfo.HeaderInfos.map(m => m.Name).join(",");

            const action = this.Page.GetAction("ExcelExport");
            action && this.ExcelExportFatchData(action, queryInfo);
        });
    }

    GetHeaderInfoList() {
        const { PageConfig } = this.Page.props
        const { DataView } = PageConfig;

        let headerInfoList = DataView.Properties.map(m => { return { Name: m.Name, Label: m.Label } });
        if (this.Page.ExpandHeaderInfoList) headerInfoList = this.Page.ExpandHeaderInfoList(headerInfoList);
        return headerInfoList;
    }

    SearchData(p, blQueryPage) {
        const { PageConfig } = this.Page.props
        const { SelectNames } = PageConfig

        if (blQueryPage === undefined) PageConfig.PageIndex = 1;
        blQueryPage = blQueryPage === undefined ? true : blQueryPage

        const queryInfo = {};

        queryInfo.FieldSql = SelectNames.join(",");
        queryInfo.OrderBySql = this.GetOrderByList().join(",");
        queryInfo.GroupBySql = "";
        queryInfo.GroupByFieldSql = "";
        queryInfo.WhereFields = this.GetConditionList();

        if (queryInfo.WhereFields === false) return;

        this.QueryInfo = queryInfo;

        //禁用查询按钮
        if (p && p.SetDisabled) p.SetDisabled(true);

        this.QueryPage(blQueryPage && PageConfig.IsPaging);

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

        const msgList = [];

        const list = SearchView.Properties.filter(f => f.IsSearch);
        list.forEach(p => {
            condition = {
                Name: p.PropertyName || p.Name,
                Label: p.Label,
                OperateLogic: p.OperateLogic || "=",
                DataType: p.DataType || "string",
                IsWhere: p.IsWhere === undefined ? true : p.IsWhere,
                Text: p.GetText === undefined ? p.Label : p.GetText(),
                Value: p.GetValue === undefined ? "" : p.GetValue()
            }
            if (!Common.IsNullOrEmpty(condition.Value)) conditionList.push(condition)
            else if (p.IsQueryNullable === false) msgList.push(p.Label + "不能为空！");
        });

        if (msgList.length > 0) { this.Page.ShowMessage(msgList.join(" ")); return false }

        if (Common.IsArray(PageConfig.DefaultConditions)) {
            PageConfig.DefaultConditions.forEach(p => {
                condition = {
                    Name: p.Name,
                    Label: p.Label,
                    OperateLogic: p.OperateLogic || "=",
                    DataType: p.DataType || "string",
                    Value: p.DefaultValue
                }
                if (p.IsCurrentUser) {
                    if (p.PropertyName) condition.Value = this.Page.LoginUser[p.PropertyName];
                    else condition.Value = this.Page.LoginUser.UserId;
                }

                if (!Common.IsNullOrEmpty(condition.Value)) conditionList.push(condition)
            });
        }

        return conditionList;
    }

    SetOrderBy(pagination, filters, sorter) {
        if (pagination.current !== this.CurrentPageIndex) { this.CurrentPageIndex = pagination.current; return; }

        if (sorter && sorter.field && sorter.order) this.OrderByList = [sorter.field + (sorter.order === "descend" ? " desc" : "")];
        else this.OrderByList = [];

        this.CurrentPageIndex = 1;
        this.Refresh("Sort");
    }

    GetOrderByList() {
        if (this.OrderByList && this.OrderByList.length > 0) return this.OrderByList;

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

    ExcelExportFatchData(action, queryInfo) {
        const { PageConfig } = this.Page.props

        let url = "View" + PageConfig.EntityName;
        if (PageConfig.QueryUrl) url = PageConfig.QueryUrl;

        if (!Common.IsNullOrEmpty(url)) {
            url += url.indexOf("?") > 0 ? "&$query=true" : "?$query=true";
            url += "&Action=Excel&Title=" + escape(PageConfig.Title) + "&EntityName=" + escape(PageConfig.EntityName);
        }

        this.Page.SetActionState(action);
        this.Page.Dispatch(action, { Url: url, QueryInfo: queryInfo })
    }

    Refresh(type, id) {
        const { PageConfig } = this.Page.props
        const { SearchView } = PageConfig
        const { PageInfo } = this.Page.props;

        this.SelectPrimaryKey = id;

        let blQueryPage = false;
        if (type === "Insert" || type === "Clear") { this.ClearConditions(type); PageConfig.PageIndex = 1; blQueryPage = true; }
        else if (type === "Delete") {
            blQueryPage = true;
            if (PageInfo && PageInfo.PageRecord % PageInfo.PageSize === 1 && PageInfo.PageIndex > 1) {
                PageConfig.PageIndex -= 1;
            }
        }
        else if (type === "Sort") PageConfig.PageIndex = 1;

        const p = Common.ArrayFirst(SearchView.Properties, (f) => f.Name === "SearchAction");

        window.setTimeout(() => this.SearchData(p, blQueryPage), 100);
    }

    ClearSearch() {
        this.Refresh("Clear");
    }

    ClearConditions(type) {
        const { PageConfig: { SearchView } } = this.Page.props

        SearchView.Properties.forEach(p => p.SetValue && p.SetValue(p.IsQueryDefault && type !== "Clear" ? p.DefaultValue : null));
    }
}