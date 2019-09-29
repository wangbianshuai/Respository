const { AssignProporties } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "FraudVerify",
        Type: "View",
        Properties: AssignProporties({ Name: "FraudVerify" }, [GetTitleView(), GetInfoView()])
    }
}

function GetTitleView() {
    return {
        Name: "FraudVerifyTitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties({ Name: "FraudVerify" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "FraudVerifyTitle", Type: "SpanText", ClassName: "LeftTitle", Text: "交叉验证" },
    GetExpandCollapse("FraudVerifyAllExpandCollapse", "全部展开", "全部收起", "ASpan", false, { marginRight: 20 }, "FraudVerifyAllExpandCollapse")]
}

function GetExpandCollapse(Name, ExpandLabel, CollapseLabel, ClassName, IsVisible, Style, EventActionName, isLoading) {
    const Value = isLoading ? "加载中……" : null;
    let AllPrpertyName = "";
    if (IsVisible) AllPrpertyName = "FraudVerifyAllExpandCollapse";
    return { Name, Type: "AExpandCollapse", IsExpanded: false, IsVisible,AllPrpertyName, Value, ExpandLabel, CollapseLabel, ClassName, Style, EventActionName }
}

function GetInfoView() {
    return {
        Name: "FraudVerify2",
        Type: "View",
        ClassName: "DivInfoView",
        IsDiv: true,
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetFraudVerify",
        GetEntityDataActionType: DataActionTypes.GetFraudVerify,
        Properties: AssignProporties({ Name: "FraudVerify" }, GetProperties())
    }
}

function GetProperties() {
    return [
        GetUserDataRiskVew(),
        GetUserDataRiskTableView(),
        GetSimilarRiskVew(),
        GetSimilarRiskTableView(),
        GetOperateRiskVew(),
        GetOperateRiskTableView()
    ]
}

//类似记录
function GetOperateRiskVew() {
    return {
        Name: "OperateRiskVew",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "FraudVerify" }, GetOperateRiskTitleProperties())
    }
}

function GetOperateRiskTitleProperties() {
    return [{ Name: "OperateRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "操作记录" },
    GetExpandCollapse("OperateRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "OperateRiskExpandCollapse", true)]
}

function GetOperateRiskTableView() {
    return { Name: "operate", Type: "DishonestyRiskTable", IsNoResult: true, IsVisible: false }
}

//类似记录
function GetSimilarRiskVew() {
    return {
        Name: "SimilarRiskVew",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "FraudVerify" }, GetSimilarRiskTitleProperties())
    }
}

function GetSimilarRiskTitleProperties() {
    return [{ Name: "SimilarRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "类似记录" },
    GetExpandCollapse("SimilarRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "SimilarRiskExpandCollapse", true)]
}

function GetSimilarRiskTableView() {
    return { Name: "similar", Type: "DishonestyRiskTable", IsNoResult: true, IsVisible: false }
}

//用户数据
function GetUserDataRiskVew() {
    return {
        Name: "UserDataRiskTitleView",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "FraudVerify" }, GetUserDataRiskTitleProperties())
    }
}

function GetUserDataRiskTitleProperties() {
    return [{ Name: "UserDataRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "用户数据" },
    GetExpandCollapse("UserDataRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "UserDataRiskExpandCollapse", true)]
}

function GetUserDataRiskTableView() {
    return { Name: "userData", Type: "DishonestyRiskTable", IsNoResult: true, IsVisible: false }
}
