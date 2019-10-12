const BillType = require("../../entities/BillType");
const { GetButton, AssignProporties, GetTextBox } = require("../../Common");

//进销管理/账目类型列表 2100-2199
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2100,
    //删除实体数据
    DeleteEntityData: 2101,
    //Excel导出
    ExcelExport: 2102
};

const Entity = { Name: BillType.Name, PrimaryKey: BillType.PrimaryKey, ViewName: "ViewBillType" }

module.exports = {
    Name: "BillTypeList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "BillTypeList" }, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({ Name: "BillTypeList" }, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditBillType", ColStyle: { paddingLeft: 0 }, ...GetButton("EditBillType", "修改", "default", 1, 2) },
        {
            EventActionName: "DeleteBillType",
            ColStyle: { paddingLeft: 0 },
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前账目类型？",
            ...GetButton("DeleteBillType", "删除", "default", 1, 4)
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
        Properties: AssignProporties(BillType, ["Name", "IncomePaymentName", "Remark", { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }])
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
        PageUrl: "/PurchaseSaleManage/BillTypeEdit"
    },
    {
        Name: "EditBillType",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/PurchaseSaleManage/BillTypeEdit?Id=#{Id}&MenuName=" + escape("修改")
    },
    {
        Name: "DeleteBillType",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}
