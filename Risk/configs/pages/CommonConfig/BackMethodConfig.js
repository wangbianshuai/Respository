const BackMethod =require( "../../entities/BackMethod");
const { GetButton, AssignProporties } =require( "../../Common");

//公共配置/还款方式配置 2000-2099
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2000,
    DeleteEntityData: 2001
}

module.exports= {
    Name: "BackMethodConfig",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"BackMethodConfig"}, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({Name:"BackMethodConfig"}, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        {
            EventActionName: "DeleteBackMethod",
            DataActionType: DataActionTypes.DeleteEntityData,
            ColStyle: { paddingLeft: 0 },
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前还款方式？",
            ...GetButton("DeleteBackMethod", "删除", "default", 1, 2)
        }
        ])
    }
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
        Entity: BackMethod,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "还款方式列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(BackMethod, ["Name", "MethodTypeName", "PeriodMethodName", "YearRateMethodName"])
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
        PageUrl: "/CommonConfig/BackMethodEdit"
    },
    {
        Name: "DeleteBackMethod",
        Type: "DataGrid/BatchUpdateRowDataList",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}