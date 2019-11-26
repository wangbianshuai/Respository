const ProductBrand = require("../../entities/ProductBrand");
const { GetButton, AssignProporties, GetTextBox } = require("../../Common");

//商品管理/商品品牌列表 500-599
const DataActionTypes = {
    //搜索查询
    SearchQuery: 500,
    //删除实体数据
    DeleteEntityData: 501,
    //Excel导出
    ExcelExport: 502
};

const Entity = { Name: ProductBrand.Name, PrimaryKey: ProductBrand.PrimaryKey, ViewName: "ViewProductBrand" }

module.exports = {
    Name: "ProductBrandList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "ProductBrandList" }, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({ Name: "ProductBrandList" }, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditProductBrand", ColStyle: { paddingLeft: 0 }, ...GetButton("EditProductBrand", "修改", "default", 1, 2) },
        {
            EventActionName: "DeleteProductBrand",
            ColStyle: { paddingLeft: 0 },
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前商品品牌？",
            ...GetButton("DeleteProductBrand", "删除", "default", 1, 4)
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
        Properties: AssignProporties(ProductBrand, ["Name", "Remark", { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }])
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
        PageUrl: "/ProductManage/ProductBrandEdit"
    },
    {
        Name: "EditProductBrand",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/ProductManage/ProductBrandEdit?Id=#{Id}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteProductBrand",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}
