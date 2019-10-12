const StockCheck = require("../../entities/StockCheck");
const { GetButton, AssignProporties, GetTextBox, GetSelect, GetDatePicker } = require("../../Common");

//商品管理/库存盘点 1300-1399
const DataActionTypes = {
    //搜索查询
    SearchQuery: 1300,
    //删除实体数据
    DeleteEntityData: 1301,
    //Excel导出
    ExcelExport: 1302
};

const Entity = { Name: StockCheck.Name, PrimaryKey: StockCheck.PrimaryKey, ViewName: "ViewStockCheck", IsGroupByInfo: true }

module.exports = {
    Name: "StockCheckList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "StockCheckList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "StockCheckList" }, [
            GetEditSelect("ProductTypeId", "类型", StockCheck.ProductTypeDataSource, 1, 1),
            GetEditSelect("ProductBrandId", "品牌", StockCheck.ProductBrandDataSource, 1, 2),
            GetEditSelect("CheckUser", "盘点员", StockCheck.UserDataSource, 1, 3),
            { ...GetDatePicker2("StartDate", "盘点日期", 2, 1, "大于或等于其值"), PropertyName: "CheckDate", OperateLogic: ">=" },
            { ...GetDatePicker2("EndDate", "至", 2, 2, "小于其值"), PropertyName: "CheckDate", OperateLogic: "<" },
            {
                ...GetTextBox2("Keyword", "关键字", 2, 3, "", "商品编号/名称"), PropertyName: "ProductName,ProductCode",
                OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
            },
            { ...GetButton("Search", "搜索", "primary", 2, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
            { ...GetButton("ClearQuery", "清空", "default", 2, 5), IsFormItem: true, EventActionName: "ClearQuery" },
            { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 3, 1), Style: { marginLeft: 16, marginBottom: 16 } },
            {
                EventActionName: "DeleteStockCheck",
                ColStyle: { paddingLeft: 0 },
                DataActionType: DataActionTypes.DeleteEntityData,
                SuccessTip: "删除成功！",
                ConfirmTip: "请确认是否删除当前库存盘点？",
                ...GetButton("DeleteStockCheck", "删除", "default", 3, 4)
            },
            { EventActionName: "ExcelExport", ...GetButton("ExcelExport", "Excel导出", "default", 3, 5), Icon: "download", ColStyle: { paddingLeft: 0 } }
        ])
    }
}

function GetDatePicker2(Name, Label, X, Y, PlaceHolder, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsFormItem: true, ColSpan: 6,
        IsNullable: true,
        PlaceHolder: PlaceHolder,
        MaxLength: 20,
        LabelCol: 8,
        WrapperCol: 15,
        DataType: "DateTime",
        IsCondition: true
    }
}

function GetEditSelect(Name, Label, DataSource, X, Y, DefaultValue) {
    return {
        ...GetSelect(Name, Label, null, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 6,
        LabelCol: 8,
        WrapperCol: 15,
        OperateLogic: "=",
        ServiceDataSource: DataSource,
        IsNullable: true,
        AllowClear: true,
        IsCondition: true
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        IsFormItem: true,
        ColSpan: 6,
        LabelCol: 8,
        WrapperCol: 15,
        IsNullable: true,
        IsCondition: true
    }
}

function GetDataGridView() {
    return {
        Name: "DataGridView1",
        Entity: Entity,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EntityExcelExport: DataActionTypes.ExcelExport,
        EventActionName: "SearchQuery",
        IsDiv: true,
        ClassName: "DivInfoView3",
        IsRowSelection: true,
        IsSingleSelection: true,
        GroupByInfoHtml: GetGroupByInfoHtml(),
        Properties: AssignProporties(StockCheck, ["ProductCode", "ProductName", "ProductTypeName", "ProductBrandName", "CurrentStock", "RealStock", "Unit", GetAmount("BidPrice"), GetAmount("LossAmount"), "CheckDate", "CheckUserName", { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }])
    }
}

function GetAmount(Name) {
    return {
        Name,
        Scale: 2, IsCurrency: true, FontColor: "#1890ff"
    }
}

function GetGroupByInfoHtml() {
    var html = [];

    html.push("亏损成本：<span style=\"color:{CostAmountColor};\">{CostAmount}</span>");

    return html.join("");
}

function GetEventActions() {
    return [{
        Name: "SearchQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "Search",
        DataGridView: "DataGridView1"
    },
    {
        Name: "ClearQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "ClearQuery",
        DataGridView: "DataGridView1",
        IsClearQuery: true
    },
    {
        Name: "ExcelExport",
        Type: "DataGridView/ExcelExport",
        DataGridView: "DataGridView1"
    },
    {
        Name: "ToEditPage",
        Type: "Page/ToPage",
        PageUrl: "/ProductManage/StockCheckEdit"
    },
    {
        Name: "DeleteStockCheck",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1"
    }]
}
