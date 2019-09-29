const { AssignProporties } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "PersonPengyuan",
        Type: "View",
        Properties: AssignProporties({ Name: "PersonPengyuan" }, [GetTitleView(), GetInfoView()])
    }
}

function GetTitleView() {
    return {
        Name: "PersonPengyuanTitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties({ Name: "PersonPengyuan" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "PersonPengyuanTitle", Type: "SpanText", ClassName: "LeftTitle", Text: "鹏元征信" },
    GetExpandCollapse("PersonPengyuanAllExpandCollapse", "全部展开", "全部收起", "ASpan", false, { marginRight: 20 }, "PersonPengyuanAllExpandCollapse")]
}

function GetExpandCollapse(Name, ExpandLabel, CollapseLabel, ClassName, IsVisible, Style, EventActionName, isLoading) {
    const Value = isLoading ? "加载中……" : null;
    let AllPrpertyName = "";
    if (IsVisible) AllPrpertyName = "PersonPengyuanAllExpandCollapse";
    return { Name, Type: "AExpandCollapse", IsExpanded: false, IsVisible, AllPrpertyName, Value, ExpandLabel, CollapseLabel, ClassName, Style, EventActionName }
}

function GetInfoView() {
    return {
        Name: "PersonPengyuan2",
        Type: "View",
        ClassName: "DivInfoView",
        IsDiv: true,
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetPengyuan",
        GetEntityDataActionType: DataActionTypes.GetPengyuan,
        Properties: AssignProporties({ Name: "PersonPengyuan" }, GetProperties())
    }
}

function GetProperties() {
    return [
        GetPersonRiskVew(),
        GetPersonRiskTableView(),
        GetQueryCountRiskVew(),
        GetQueryCountRiskTableView()
    ]
}

//查询次数
function GetQueryCountRiskVew() {
    return {
        Name: "QueryCountRiskVew",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "PersonPengyuan" }, GetQueryCountRiskTitleProperties())
    }
}

function GetQueryCountRiskTitleProperties() {
    return [{ Name: "QueryCountRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "查询次数" },
    GetExpandCollapse("QueryCountRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "QueryCountRiskExpandCollapse", true)]
}

function GetQueryCountRiskTableView() {
    return { Name: "QueryCountRiskTable", Type: "DishonestyRiskTable", IsVisible: false }
}

//个人风险核查
function GetPersonRiskVew() {
    return {
        Name: "PersonRiskTitleView",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "PersonPengyuan" }, GetPersonRiskTitleProperties())
    }
}

function GetPersonRiskTitleProperties() {
    return [{ Name: "PersonRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "个人风险核查" },
    GetExpandCollapse("PersonRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "PersonRiskExpandCollapse", true)]
}

function GetPersonRiskTableView() {
    return { Name: "PersonRiskTable", Type: "DishonestyRiskTable", IsVisible: false }
}
