import BackMethod from "../../entities/BackMethod";
import { GetButton, AssignProporties, CreateGuid, GetTextBox } from "../Common";

//公共配置/还款方式配置 2000-2099
const DataActionTypes = {
    //搜索查询
    SearchQuery: 2000,
    DeleteEntityData: 2001
}

export default {
    Name: "BackMethodConfig",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties(BackMethod, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Id: CreateGuid(),
        Name: "SearchOperationView1",
        Entity: BackMethod,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(BackMethod, [{ EventActionName: "ToEditPage", ...GetButton("ToEditPage", "新增", "primary", 1, 1) },
        {
            EventActionName: "DeleteBackMethod",
            DataActionType: DataActionTypes.DeleteEntityData,
            SuccessTip: "删除成功！",
            ConfirmTip: "请确认是否删除当前还款方式？",
            ...GetButton("DeleteBackMethod", "删除", "default", 1, 2)
        },
        GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.EventActionName = "SearchQuery";
    p.ColStyle = { width: 300 };
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
        Id: CreateGuid(),
        Name: "DataGridView1",
        Entity: BackMethod,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "还款方式列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(BackMethod, ["Name", "MethodType", "PeriodMethod", "YearRateMethod", "CreateUser", "CreateDate"])
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