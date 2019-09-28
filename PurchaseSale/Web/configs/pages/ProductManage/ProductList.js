const Product = require("../../entities/Product");
const { GetButton, AssignProporties, GetTextBox, GetSelect } = require("../../Common");

//商品管理/商品列表 1100-1199
const DataActionTypes = {
    //搜索查询
    SearchQuery: 1100,
    //删除实体数据
    DeleteEntityData: 1101
};

const Entity = { Name: Product.Name, PrimaryKey: Product.PrimaryKey, ViewName: "ViewProduct", IsGroupByInfo: true }

module.exports = {
    Name: "ProductList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "ProductList" }, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivSerachView",
        Properties: AssignProporties({ Name: "ProductList" }, [
            GetEditSelect("ProductTypeId", "类型", Product.ProductTypeDataSource, 1, 1),
            GetEditSelect("ProductBrandId", "品牌", Product.ProductBrandDataSource, 1, 2),
            {
                ...GetTextBox2("Keyword", "关键字", 1, 3, "", "编号/名称"), PropertyName: "Name,ProductCode",
                OperateLogic: "like", PressEnterEventActionName: "SearchQuery"
            },
            { ...GetButton("Search", "搜索", "primary", 1, 4), IsFormItem: true, Icon: "search", EventActionName: "SearchQuery", PressEnterEventActionName: "SearchQuery" },
            { ...GetButton("ClearQuery", "清空", "default", 1, 5), IsFormItem: true, EventActionName: "ClearQuery" },
            { EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 2, 1), Style: { marginLeft: 16, marginBottom: 16 } },
            { EventActionName: "EditProduct", ColStyle: { paddingLeft: 0 }, ...GetButton("EditProduct", "修改", "default", 2, 2) },
            {
                EventActionName: "DeleteProduct",
                ColStyle: { paddingLeft: 0 },
                DataActionType: DataActionTypes.DeleteEntityData,
                SuccessTip: "删除成功！",
                ConfirmTip: "请确认是否删除当前商品？",
                ...GetButton("DeleteProduct", "删除", "default", 2, 4)
            }
        ])
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
        EventActionName: "SearchQuery",
        IsDiv: true,
        ClassName: "DivInfoView3",
        IsRowSelection: true,
        IsSingleSelection: true,
        GroupByInfoHtml: GetGroupByInfoHtml(),
        Properties: AssignProporties(Product, ["ProductCode", "Name", "ProductTypeName", "ProductBrandName", GetAmount("BidPrice"), GetAmount("SillingPrice"), "InitStock", "CurrentStock", "Unit", { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }])
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

    html.push("当前库存成本：<span style=\"color:{CostAmountColor};\">{CostAmount}</span>");

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
        Name: "ToEditPage",
        Type: "Page/ToPage",
        PageUrl: "/ProductManage/ProductEdit"
    },
    {
        Name: "EditProduct",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        PageUrl: "/ProductManage/ProductEdit?Id=#{Id}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteProduct",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1"
    }]
}
