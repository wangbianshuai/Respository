const PersonBillType = require("../../entities/PersonBillType");
const { GetButton, AssignProporties, GetTextBox } = require("../../Common");

//个人记账/账目类型列表 1500-1599
const DataActionTypes = {
    //搜索查询
    SearchQuery: 1500,
    //删除实体数据
    DeleteEntityData: 1501
};

const Entity = { Name: PersonBillType.Name, PrimaryKey: PersonBillType.PrimaryKey, ViewName: "ViewPersonBillType" }

module.exports = {
    Name: "PersonBillTypeList",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "PersonBillTypeList" }, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: Entity,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        DefaultConditions: GetDefaultConditions(),
        Properties: AssignProporties({ Name: "PersonBillTypeList" }, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        { EventActionName: "EditPersonBillType", ColStyle: { paddingLeft: 0 }, ...GetButton("EditPersonBillType", "修改", "default", 1, 2) },
        {
            EventActionName: "DeletePersonBillType",
            ColStyle: { paddingLeft: 0 },
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前账目类型？",
            ...GetButton("DeletePersonBillType", "删除", "default", 1, 4)
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
        Properties: AssignProporties(PersonBillType, ["Name", "IncomePaymentName", "Remark", { Name: "CreateDate", OrderByType: "desc" }, { Name: "RowVersion", IsVisible: false }])
    }
}


function GetDefaultConditions() {
    return [{
        Name: "CreateUser",
        Type: "Guid",
        IsCurrentUser: true
    }]
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
        PageUrl: "/PersonBillManage/PersonBillTypeEdit"
    },
    {
        Name: "EditPersonBillType",
        Type: "DataGridView/SelectRowToPage",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage",
        PageUrl: "/PersonBillManage/PersonBillTypeEdit?Id=#{Id}&MenuName=" + escape("修改")
    },
    {
        Name: "DeletePersonBillType",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}
