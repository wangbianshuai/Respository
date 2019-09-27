const Product = require("../../entities/Product");
const { GetButton, AssignProporties, GetTextBox } = require("../../Common");

//商品管理/商品列表 1100-1199
const DataActionTypes = {
    //搜索查询
    SearchQuery: 1100,
    //删除实体数据
    DeleteEntityData: 1101
};

const Entity = { Name: Product.Name, PrimaryKey: Product.PrimaryKey, ViewName: "ViewProduct" }

module.exports = {
    Name: "ProductList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "ProductList" }, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({ Name: "ProductList" }, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditProduct", ColStyle: { paddingLeft: 0 }, ...GetButton("EditProduct", "修改", "default", 1, 2) },
        {
            EventActionName: "DeleteProduct",
            ColStyle: { paddingLeft: 0 },
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前商品品牌？",
            ...GetButton("DeleteProduct", "删除", "default", 1, 4)
        },
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入关键字")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.PropertyName = "Name,Remark";
    p.OperateLogic = "like";
    p.EventActionName = "SearchQuery";
    p.PressEnterEventActionName = "SearchQuery";
    p.ColStyle = { width: 240 }
    return p;
}

function GetAlert() {
    return {
        Name: "AlertMessage",
        Type: "Alert"
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
        Properties: AssignProporties(Product, ["Name", "Remark", { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }])
    }
}


function GetEventActions() {
    return [{
        Name: "SearchQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "Keyword",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
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
        AlertMessage: "AlertMessage",
        PageUrl: "/ProductManage/ProductEdit?Id=#{Id}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteProduct",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}
