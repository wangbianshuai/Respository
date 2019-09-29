const NetCheck =require( "../../entities/NetCheck");
const { GetButton, AssignProporties, CreateGuid, GetTextBox, GetSelect, GetRadio } =require( "../../Common");

const DataActionTypes = {
    //搜索查询
    SearchQuery: 4200,
    //复核
    Review: 4201
};

module.exports= {
    Name: "WebQueryReview",
    Type: "View",
    DialogViews: GetDialogViews(),
    EventActions: GetEventActions(),
    Properties: AssignProporties(NetCheck, [GetSearchOperationView(), GetAlert(), GetDataGridView()])
}

function GetSearchOperationView() {
    return {
        Name: "SearchOperationView1",
        Entity: NetCheck,
        Type: "RowsColsView",
        ClassName: "DivLeftRightView",
        Properties: AssignProporties(NetCheck, [{ EventActionName: "Review", ...GetButton("Review", "复核", "primary", 1, 1) },
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
    const p = GetSelect("QueryName", "", GetQueryNameDataSource(), 2, 2, "name");
    p.ColStyle = { paddingRight: 0, paddingLeft: 8 };
    p.Width = 120;
    p.IsCondition = true;
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
        Entity: NetCheck,
        Type: "DataGridView",
        EntitySearchQuery: DataActionTypes.SearchQuery,
        EventActionName: "SearchQuery",
        Title: "待复核列表",
        IsRowSelection: true,
        IsSingleSelection: true,
        Properties: AssignProporties(NetCheck, ["UserName", "BorrowerUser", "Phone", "IdNumber", "LoanUser", "QueryDate", "ReviewDate", "NetCheckStatus"])
    }
}

function GetQueryNameDataSource() {
    return [{ Value: "name", Text: "借款人" }, { Value: "mobile", Text: "手机号" }, { Value: "idNumber", Text: "身份证号" }]
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
        Name: "Review",
        Type: "EntityEdit/SelectRowUpdate",
        DialogView: "UpdateEntityEdit1",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    }]
}


function GetDialogViews() {
    return [{
        Id: CreateGuid(),
        DialogId: CreateGuid(),
        Name: "UpdateEntityEdit1",
        Entity: NetCheck,
        Type: "RowsColsView",
        DialogTitle: "复核",
        SuccessTip: "复核成功！",
        UdpateEntityOkActionType: DataActionTypes.Review,
        Properties: AssignProporties(NetCheck, [
            GetOpinionRadio(),
            GetTextArea("remark", "备注", 2, 1)
        ])
    }]
}
function GetTextArea(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsEdit: true,
        ColSpan: 24,
        Rows: 3,
        LabelCol: 4,
        WrapperCol: 18
    }
}

function GetOpinionRadio() {
    return {
        ...GetRadio("result", "意见", GetOpinionStatusDataSource(), 1, 1),
        IsFormItem: true,
        ColSpan: 24,
        IsButton: false,
        IsNullable: false,
        IsEdit: true,
        LabelCol: 4,
        WrapperCol: 18
    }
}

function GetOpinionStatusDataSource() {
    return [{ Value: "1", Text: "通过" }, { Value: "2", Text: "拒绝" }]
}
