const { AssignProporties } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "CompanyPengyuan",
        Type: "View",
        Properties: AssignProporties({ Name: "CompanyPengyuan" }, [GetTitleView(), GetInfoView()])
    }
}

function GetTitleView() {
    return {
        Name: "CompanyPengyuanTitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties({ Name: "CompanyPengyuan" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "CompanyPengyuanTitle", Type: "SpanText", ClassName: "LeftTitle", Text: "鹏元征信" },
    GetExpandCollapse("CompanyPengyuanAllExpandCollapse", "全部展开", "全部收起", "ASpan", false, { marginRight: 20 }, "CompanyPengyuanAllExpandCollapse")]
}

function GetExpandCollapse(Name, ExpandLabel, CollapseLabel, ClassName, IsVisible, Style, EventActionName, isLoading) {
    const Value = isLoading ? "加载中……" : null;
    let AllPrpertyName = "";
    if (IsVisible) AllPrpertyName = "CompanyPengyuanAllExpandCollapse";
    return { Name, Type: "AExpandCollapse", IsExpanded: false, IsVisible, AllPrpertyName, Value, ExpandLabel, CollapseLabel, ClassName, Style, EventActionName }
}

function GetInfoView() {
    return {
        Name: "CompanyPengyuan2",
        Type: "View",
        ClassName: "DivInfoView",
        IsDiv: true,
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetCompanyPengyuan",
        GetEntityDataActionType: DataActionTypes.GetCompanyPengyuan,
        Properties: AssignProporties({ Name: "CompanyPengyuan" }, GetProperties())
    }
}

function GetProperties() {
    return [
        GetCompanyRiskVew(),
        GetCompanyRiskTableView(),
        GetCompanyQueryCountRiskVew(),
        GetCompanyQueryCountRiskTableView()
    ]
}

//查询信息
function GetCompanyQueryCountRiskVew() {
    return {
        Name: "CompanyQueryCountRiskVew",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "CompanyPengyuan" }, GetCompanyQueryCountRiskTitleProperties())
    }
}

function GetCompanyQueryCountRiskTitleProperties() {
    return [{ Name: "CompanyQueryCountRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "查询信息" },
    GetExpandCollapse("CompanyQueryCountRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "CompanyQueryCountRiskExpandCollapse", true)]
}

function GetCompanyQueryCountRiskTableView() {
    return { Name: "CompanyQueryCountRiskTable", Type: "DishonestyRiskTable", IsVisible: false, ItemTitle: "查询机构名称", ItemResult: "查询日期" }
}

//个人风险核查
function GetCompanyRiskVew() {
    return {
        Name: "CompanyRiskTitleView",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "CompanyPengyuan" }, GetCompanyRiskTitleProperties())
    }
}

function GetCompanyRiskTitleProperties() {
    return [{ Name: "CompanyRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "企业风险核查" },
    GetExpandCollapse("CompanyRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "CompanyRiskExpandCollapse", true)]
}

function GetCompanyRiskTableView() {
    return { Name: "CompanyRiskTable", Type: "DishonestyRiskTable", IsVisible: false }
}
