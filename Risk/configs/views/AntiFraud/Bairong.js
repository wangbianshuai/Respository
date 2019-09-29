const { AssignProporties } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "Bairong",
        Type: "View",
        Properties: AssignProporties({ Name: "Bairong" }, [GetTitleView(), GetInfoView()])
    }
}

function GetTitleView() {
    return {
        Name: "BairongTitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties({ Name: "Bairong" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "BairongTitle", Type: "SpanText", ClassName: "LeftTitle", Text: "百融" },
    GetExpandCollapse("BairongAllExpandCollapse", "全部展开", "全部收起", "ASpan", false, { marginRight: 20 }, "BairongAllExpandCollapse")]
}

function GetExpandCollapse(Name, ExpandLabel, CollapseLabel, ClassName, IsVisible, Style, EventActionName, isLoading) {
    const Value = isLoading ? "加载中……" : null;
    let AllPrpertyName = "";
    if (IsVisible) AllPrpertyName = "BairongAllExpandCollapse";
    return { Name, Type: "AExpandCollapse", IsExpanded: false, IsVisible, AllPrpertyName, Value, ExpandLabel, CollapseLabel, ClassName, Style, EventActionName }
}

function GetInfoView() {
    return {
        Name: "Bairong2",
        Type: "View",
        ClassName: "DivInfoView",
        IsDiv: true,
        Properties: AssignProporties({ Name: "Bairong" }, [GetBairongSpecial(), GetBairongApply()])
    }
}

function GetBairongApply() {
    return {
        Name: "BairongApply",
        Type: "View",
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetBairongApply",
        GetEntityDataActionType: DataActionTypes.GetBairongApply,
        Properties: AssignProporties({ Name: "Bairong" }, GetProperties1())
    }
}

function GetBairongSpecial() {
    return {
        Name: "BairongSpecial",
        Type: "View",
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetBairongSpecial",
        GetEntityDataActionType: DataActionTypes.GetBairongSpecial,
        Properties: AssignProporties({ Name: "Bairong" }, GetProperties2())
    }
}

function GetProperties1() {
    return [
        GetBairongApplyRiskVew(),
        GetBairongApplyRiskTableView()
    ]
}

function GetProperties2() {
    return [
        GetBairongSpecialRiskVew(),
        GetBairongSpecialRiskTableView()
    ]
}

//多次申请核查
function GetBairongApplyRiskVew() {
    return {
        Name: "BairongApplyRiskVew",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "Bairong" }, GetBairongApplyRiskTitleProperties())
    }
}

function GetBairongApplyRiskTitleProperties() {
    return [{ Name: "BairongApplykRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "多次申请核查" },
    GetExpandCollapse("BairongApplyRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "BairongApplyRiskExpandCollapse", true)]
}

function GetBairongApplyRiskTableView() {
    return { Name: "BairongApplyRiskTable", Type: "MultiRiskTable", IsContentBefore: true, IsVisible: false }
}

//特殊名单核查
function GetBairongSpecialRiskVew() {
    return {
        Name: "BairongSpecialRiskTitleView",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "Bairong" }, GetBairongSpecialRiskTitleProperties())
    }
}

function GetBairongSpecialRiskTitleProperties() {
    return [{ Name: "BairongSpecialRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "特殊名单核查" },
    GetExpandCollapse("BairongSpecialRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "BairongSpecialRiskExpandCollapse", true)]
}

function GetBairongSpecialRiskTableView() {
    return { Name: "BairongSpecialRiskTable", Type: "DishonestyRiskTable", IsVisible: false }
}
