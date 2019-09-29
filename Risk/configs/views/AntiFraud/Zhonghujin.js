const { AssignProporties } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "Zhonghujin",
        Type: "View",
        Properties: AssignProporties({ Name: "Zhonghujin" }, [GetTitleView(), GetInfoView()])
    }
}

function GetTitleView() {
    return {
        Name: "ZhonghujinTitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties({ Name: "Zhonghujin" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "ZhonghujinTitle", Type: "SpanText", ClassName: "LeftTitle", Text: "中互金协会" },
    GetExpandCollapse("ZhonghujinAllExpandCollapse", "全部展开", "全部收起", "ASpan", false, { marginRight: 20 }, "ZhonghujinAllExpandCollapse")]
}

function GetExpandCollapse(Name, ExpandLabel, CollapseLabel, ClassName, IsVisible, Style, EventActionName, isLoading) {
    const Value = isLoading ? "加载中……" : null;
    let AllPrpertyName = "";
    if (IsVisible) AllPrpertyName = "ZhonghujinAllExpandCollapse";
    return { Name, Type: "AExpandCollapse", IsExpanded: false, IsVisible, AllPrpertyName, Value, ExpandLabel, CollapseLabel, ClassName, Style, EventActionName }
}

function GetInfoView() {
    return {
        Name: "Zhonghujin2",
        Type: "View",
        ClassName: "DivInfoView",
        IsDiv: true,
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetZhonghujin",
        GetEntityDataActionType: DataActionTypes.GetZhonghujin,
        Properties: AssignProporties({ Name: "Zhonghujin" }, GetProperties())
    }
}

function GetProperties() {
    return [
        GetZhonghujinRiskTitleView(),
        GetZhonghujinRiskTableView()
    ]
}

//个人司法涉诉
function GetZhonghujinRiskTitleView() {
    return {
        Name: "ZhonghujinRiskTitleView",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "Zhonghujin" }, GetZhonghujinRiskTitleProperties())
    }
}

function GetZhonghujinRiskTitleProperties() {
    return [{ Name: "ZhonghujinRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "中互金协会检查" },
    GetExpandCollapse("ZhonghujinRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "ZhonghujinRiskExpandCollapse", true)]
}

function GetZhonghujinRiskTableView() {
    return { Name: "ZhonghujinRiskTable", Type: "DishonestyRiskTable", IsVisible: false }
}
