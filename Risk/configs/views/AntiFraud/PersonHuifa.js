const { AssignProporties } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "PersonHuifa",
        Type: "View",
        Properties: AssignProporties({ Name: "PersonHuifa" }, [GetTitleView(), GetInfoView()])
    }
}

function GetTitleView() {
    return {
        Name: "PersonHuifaTitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties({ Name: "PersonHuifa" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "PersonHuifaTitle", Type: "SpanText", ClassName: "LeftTitle", Text: "汇法" },
    GetExpandCollapse("PersonHuifaAllExpandCollapse", "全部展开", "全部收起", "ASpan", false, { marginRight: 20 }, "PersonHuifaAllExpandCollapse")]
}

function GetExpandCollapse(Name, ExpandLabel, CollapseLabel, ClassName, IsVisible, Style, EventActionName, isLoading) {
    const Value = isLoading ? "加载中……" : null;
    let AllPrpertyName = "";
    if (IsVisible) AllPrpertyName = "PersonHuifaAllExpandCollapse";
    return { Name, Type: "AExpandCollapse", IsExpanded: false, IsVisible, AllPrpertyName, Value, ExpandLabel, CollapseLabel, ClassName, Style, EventActionName }
}

function GetInfoView() {
    return {
        Name: "PersonHuifa2",
        Type: "View",
        ClassName: "DivInfoView",
        IsDiv: true,
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetHuifa",
        GetEntityDataActionType: DataActionTypes.GetHuifa,
        Properties: AssignProporties({ Name: "PersonHuifa" }, GetProperties())
    }
}

function GetProperties() {
    return [
        GetPersonHuifaRiskTitleView(),
        GetPersonHuifaRiskTableView()
    ]
}

//个人司法涉诉
function GetPersonHuifaRiskTitleView() {
    return {
        Name: "PersonHuifaRiskTitleView",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "PersonHuifa" }, GetPersonHuifaRiskTitleProperties())
    }
}

function GetPersonHuifaRiskTitleProperties() {
    return [{ Name: "PersonHuifaRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "个人司法涉诉" },
    GetExpandCollapse("PersonHuifaRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "PersonHuifaRiskExpandCollapse", true)]
}

function GetPersonHuifaRiskTableView() {
    return { Name: "PersonHuifaRiskTable", Type: "DishonestyRiskTable", IsVisible: false }
}
