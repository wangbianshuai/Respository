import User from "../../entities/User";
import { AssignProporties, CreateGuid, GetTextBox, GetSelect } from "../Common";

//权限管理/用户编辑 3900-3999
const DataActionTypes = {
    //搜索查询
    SearchQuery: 3902
};

export default {
    Id: CreateGuid(),
    DialogId: CreateGuid(),
    Name: "SelectUserView",
    Entity: User,
    Type: "View",
    DialogWidth: 1000,
    DialogTitle: "选择用户",
    DialogStyle: { maxHeight: 500, overflow: "auto" },
    BodyStyle: { padding: "0 16px", margin: 0 },
    Properties: AssignProporties(User, [GetSearchOperationView(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Id: CreateGuid(),
        Name: "SearchOperationView1",
        Entity: User,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(User, [
            GetQueryName(),
            GetKeyword()
        ])
    }
}

function GetKeyword() {
    const p = GetTextBox("Keyword", "", "Search", 2, 3, "请输入")
    p.ColStyle = { paddingRight: 8, paddingLeft: 2 };
    p.IsCondition = true;
    p.EventActionName = "SearchQuery";
    p.ColStyle = { width: 240 }
    return p;
}

function GetQueryName() {
    const p = GetSelect("QueryName", "", GetQueryNameDataSource(), 2, 2, "UserName");
    p.ColStyle = { paddingRight: 0, paddingLeft: 8 };
    p.Width = 100;
    p.IsCondition = true;
    return p;
}

function GetDataGridView() {
    return {
        Id: CreateGuid(),
        Name: "DataGridView1",
        Entity: User,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(User, ["UserName", "Email", "Phone", "JobName", "DepartName"])
    }
}

function GetQueryNameDataSource() {
    return [{ Value: "UserName", Text: "姓名" }, { Value: "Email", Text: "邮箱" }]
}
