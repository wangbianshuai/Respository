const { AssignProporties } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "CompanyHuifa",
        Type: "View",
        Properties: AssignProporties({ Name: "CompanyHuifa" }, [GetTitleView(), GetInfoView()])
    }
}

function GetTitleView() {
    return {
        Name: "CompanyHuifaTitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties({ Name: "CompanyHuifa" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "CompanyHuifaTitle", Type: "SpanText", ClassName: "LeftTitle", Text: "汇法" },
    GetExpandCollapse("CompanyHuifaAllExpandCollapse", "全部展开", "全部收起", "ASpan", false, { marginRight: 20 }, "CompanyHuifaAllExpandCollapse")]
}

function GetExpandCollapse(Name, ExpandLabel, CollapseLabel, ClassName, IsVisible, Style, EventActionName, isLoading) {
    const Value = isLoading ? "加载中……" : null;
    let AllPrpertyName = "";
    if (IsVisible) AllPrpertyName = "CompanyHuifaAllExpandCollapse";
    return { Name, Type: "AExpandCollapse", IsExpanded: false, IsVisible, AllPrpertyName, Value, ExpandLabel, CollapseLabel, ClassName, Style, EventActionName }
}

function GetInfoView() {
    return {
        Name: "CompanyHuifa2",
        Type: "View",
        ClassName: "DivInfoView",
        IsDiv: true,
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetCompanyHuifa",
        GetEntityDataActionType: DataActionTypes.GetCompanyHuifa,
        Properties: AssignProporties({ Name: "CompanyHuifa" }, GetProperties())
    }
}

function GetProperties() {
    return [
        GetCompanyHuifaRiskTitleView(),
        GetCompanyHuifaRiskTableView()
    ]
}

//企业司法涉诉
function GetCompanyHuifaRiskTitleView() {
    return {
        Name: "CompanyHuifaRiskTitleView",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "CompanyHuifa" }, GetCompanyHuifaRiskTitleProperties())
    }
}

function GetCompanyHuifaRiskTitleProperties() {
    return [{ Name: "CompanyHuifaRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "企业司法涉诉" },
    GetExpandCollapse("CompanyHuifaRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "CompanyHuifaRiskExpandCollapse", true)]
}

function GetCompanyHuifaRiskTableView() {
    return { Name: "CompanyHuifaRiskTable", Type: "DishonestyRiskTable", IsVisible: false }
}
