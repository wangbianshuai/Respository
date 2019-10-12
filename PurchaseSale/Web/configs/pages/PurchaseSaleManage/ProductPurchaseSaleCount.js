const ProductPurchaseSale = require("../../entities/ProductPurchaseSale");
const { GetButton, AssignProporties, GetDatePicker, GetSelect, GetTextBox } = require("../../Common");

//进销管理/商品进销统计 3200-3299
const DataActionTypes = {
    //搜索查询
    SearchQuery: 3200,
    //Excel导出
    ExcelExport: 3202
};

const Entity = { Name: ProductPurchaseSale.Name, PrimaryKey: ProductPurchaseSale.PrimaryKey }

module.exports = {
    Name: "ProductPurchaseSaleCount",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "ProductPurchaseSaleCount" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "ProductPurchaseSaleCount" }, [

            { ...GetDatePicker2("StartDate", "日期", 1, 1, "大于或等于其值"), PropertyName: "SaleDate", OperateLogic: ">=" },
            { ...GetDatePicker2("EndDate", "至", 1, 2, "小于其值"), PropertyName: "SaleDate", OperateLogic: "<" },
            GetEditSelect("ProductTypeId", "类型", ProductPurchaseSale.ProductTypeDataSource, 1, 3),
            GetEditSelect("ProductBrandId", "品牌", ProductPurchaseSale.ProductBrandDataSource, 2, 1),
            {
                ...GetTextBox2("Keyword", "关键字", 2, 2, "", "商品名称/编号"), PropertyName: "ProductName",
                OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
            },
            { ...GetButton("Search", "搜索", "primary", 2, 3), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
            { ...GetButton("ClearQuery", "清空", "default", 2, 4), IsFormItem: true, EventActionName: "ClearQuery" },
            { EventActionName: "ExcelExport", ...GetButton("ExcelExport", "Excel导出", "primary", 3, 1), Style: { marginLeft: 16, marginBottom: 16 } }
        ])
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

function GetDataGridView() {
    return {
        Name: "DataGridView1",
        Entity: Entity,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        IsDiv: true,
        ClassName: "DivInfoView3",
        SetColumnsEventActionName: "SetShowColumns",
        IsPartPaging: true,
        IsGroupByQuery: true,
        Properties: AssignProporties(ProductPurchaseSale, [{ Name: "SaleDate", OrderByType: "desc", IsVisible: false }, "SaleYear", "SaleMonth", "SaleDay", "ProductName", "ProductTypeName", "ProductBrandName", GetAmount("PurchaseAmount"), GetAmount("PurchaseDiscount"),
        GetAmount("SaleAmount"), GetAmount("SaleBidAmount"), GetAmount("SaleProfit"), GetAmount("SaleDiscount")])
    }
}

function GetAmount(Name) {
    return {
        Name,
        GroupByExpression: `sum(${Name})`,
        Scale: 2, IsCurrency: true, FontColor: "#1890ff"
    }
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
        Name: "SetShowColumns",
        Type: "DataGrid/SetDataGridShowColumns",
        DataGridView: "DataGridView1"
    }]
}
