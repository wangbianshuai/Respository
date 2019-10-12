const Supplier = require("../../entities/Supplier");
const { GetButton, AssignProporties, GetTextBox } = require("../../Common");

//进销管理/供应商 1900-1999
const DataActionTypes = {
    //搜索查询
    SearchQuery: 1900,
    //删除实体数据
    DeleteEntityData: 1901,
    //Excel导出
    ExcelExport: 1902
};

const Entity = { Name: Supplier.Name, PrimaryKey: Supplier.PrimaryKey, ViewName: "ViewSupplier" }

module.exports = {
    Name: "SupplierList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "SupplierList" }, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({ Name: "SupplierList" }, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditSupplier", ColStyle: { paddingLeft: 0 }, ...GetButton("EditSupplier", "修改", "default", 1, 2) },
        {
            EventActionName: "DeleteSupplier",
            ColStyle: { paddingLeft: 0 },
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前供应商？",
            ...GetButton("DeleteSupplier", "删除", "default", 1, 4)
        },
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "名称/公司名称/联系人/手机/电话")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.PropertyName = "Name,CompanyName,Linkman,Phone,Telephone";
    p.OperateLogic = "like";
    p.EventActionName = "SearchQuery";
    p.PressEnterEventActionName = "SearchQuery";
    p.ColStyle = { width: 360 }
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
        Properties: AssignProporties(Supplier, ["Name", "CompanyName", "Linkman", "Phone", "Telephone", "Fax", "Address", { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }])
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
        PageUrl: "/PurchaseSaleManage/SupplierEdit"
    },
    {
        Name: "EditSupplier",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/PurchaseSaleManage/SupplierEdit?Id=#{Id}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteSupplier",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}
