const { AssignProporties } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "WhiteKnight",
        Type: "View",
        Properties: AssignProporties({ Name: "WhiteKnight" }, [GetTitleView(), GetInfoView()])
    }
}

function GetTitleView() {
    return {
        Name: "TitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties({ Name: "WhiteKnight" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "Title", Type: "SpanText", ClassName: "LeftTitle", Text: "白骑士反欺诈云" },
    GetExpandCollapse("AllExpandCollapse", "全部展开", "全部收起", "ASpan", false, { marginRight: 20 }, "AllExpandCollapse")]
}

function GetExpandCollapse(Name, ExpandLabel, CollapseLabel, ClassName, IsVisible, Style, EventActionName, isLoading) {
    const Value = isLoading ? "加载中……" : null;
    let AllPrpertyName = "";
    if (IsVisible) AllPrpertyName = "AllExpandCollapse";
    return { Name, Type: "AExpandCollapse", IsExpanded: false, IsVisible, AllPrpertyName, Value, ExpandLabel, CollapseLabel, ClassName, Style, EventActionName }
}

function GetInfoView() {
    return {
        Name: "WhiteKnight2",
        Type: "View",
        ClassName: "DivInfoView",
        IsDiv: true,
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetBaiqishi",
        GetEntityDataActionType: DataActionTypes.GetBaiqishi,
        Properties: AssignProporties({ Name: "WhiteKnight" }, GetProperties())
    }
}

function GetProperties() {
    return [
        GetDishonestyRiskVew(),
        GetDishonestyRiskTableView(),
        GetMultiRiskVew(),
        GetMultiRiskTableView()
    ]
}

//多头风险策略
function GetMultiRiskVew() {
    return {
        Name: "MultiRiskVew",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "WhiteKnight" }, GetMultiRiskTitleProperties())
    }
}

function GetMultiRiskTitleProperties() {
    return [{ Name: "MultiRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "多头风险策略" },
    GetExpandCollapse("MultiRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "MultiRiskExpandCollapse", true)]
}

function GetMultiRiskTableView() {
    return { Name: "MultiRiskTable", Type: "MultiRiskTable", IsVisible: false }
}

//失信风险策略
function GetDishonestyRiskVew() {
    return {
        Name: "DishonestyRiskTitleView",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "WhiteKnight" }, GetDishonestyRiskTitleProperties())
    }
}

function GetDishonestyRiskTitleProperties() {
    return [{ Name: "DishonestyRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "失信风险策略" },
    GetExpandCollapse("DishonestyRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "DishonestyRiskExpandCollapse", true)]
}

function GetDishonestyRiskTableView() {
    return { Name: "DishonestyRiskTable", Type: "DishonestyRiskTable", IsVisible: false }
}
