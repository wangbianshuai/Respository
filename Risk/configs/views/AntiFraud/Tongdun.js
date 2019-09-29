const { AssignProporties } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "Tongdun",
        Type: "View",
        Properties: AssignProporties({ Name: "Tongdun" }, [GetTitleView(), GetInfoView()])
    }
}

function GetTitleView() {
    return {
        Name: "TitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties({ Name: "Tongdun" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "TongdunTitle", Type: "SpanText", ClassName: "LeftTitle", Text: "同盾信贷保镖" },
    GetExpandCollapse("TongdunAllExpandCollapse", "全部展开", "全部收起", "ASpan", false, { marginRight: 20 }, "TongdunAllExpandCollapse")]
}

function GetExpandCollapse(Name, ExpandLabel, CollapseLabel, ClassName, IsVisible, Style, EventActionName, isLoading) {
    const Value = isLoading ? "加载中……" : null;
    let AllPrpertyName = "";
    if (IsVisible) AllPrpertyName = "TongdunAllExpandCollapse";
    return { Name, Type: "AExpandCollapse", IsExpanded: false, IsVisible, AllPrpertyName, Value, ExpandLabel, CollapseLabel, ClassName, Style, EventActionName }
}

function GetInfoView() {
    return {
        Name: "Tongdun2",
        Type: "View",
        ClassName: "DivInfoView",
        IsDiv: true,
        Entity: { PrimaryKey: "OrderCode" },
        EventActionName: "GetTongdun",
        GetEntityDataActionType: DataActionTypes.GetTongdun,
        Properties: AssignProporties({ Name: "Tongdun" }, GetProperties())
    }
}

function GetProperties() {
    return [
        GetTongdunRiskTitleView(),
        GetTongdunRiskTableView()
    ]
}

//个人司法涉诉
function GetTongdunRiskTitleView() {
    return {
        Name: "TongdunRiskTitleView",
        Type: "View",
        ClassName: "DivRiskTitleView",
        IsDiv: true,
        IsView: true,
        Properties: AssignProporties({ Name: "Tongdun" }, GetTongdunRiskTitleProperties())
    }
}

function GetTongdunRiskTitleProperties() {
    return [{ Name: "TongdunRiskTitle", Type: "SpanText", ClassName: "ALeftTitle", Text: "同盾规则检查" },
    GetExpandCollapse("TongdunRiskExpandCollapse", "展开", "收起", "ASpan", true, { marginRight: 20 }, "TongdunRiskExpandCollapse", true)]
}

function GetTongdunRiskTableView() {
    return { Name: "TongdunRiskTable", Type: "DishonestyRiskTable", IsVisible: false }
}
