const OrderBaseInfo = require("../../entities/OrderBaseInfo");

const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

var DataActionTypes = {}
var _IsNoGet = false;

module.exports = (actionTypes, blNoGet) => {
    DataActionTypes = actionTypes;
    _IsNoGet = blNoGet;

    return {
        Name: "OrderBaseInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "OrderBaseInfo" }, [GetTitleView(), GetInfoView()])
    }
}

function GetTitleView() {
    return {
        Name: "TitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties({ Name: "OrderBaseInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "Title", Type: "SpanText", ClassName: "LeftTitle", Text: "工单编号-#{OrderCode}" },
    { ...GetButton("ToOrderDetail", "进件详情", ""), EventActionName: "ToOrderDetail", Style: { marginRight: 20 } }]
}

function GetInfoView() {
    const view = {
        Name: "OrderInfo",
        Type: "RowsColsView",
        Entity: OrderBaseInfo,
        IsForm: true,
        LabelAlign: "left",
        IsDiv: true,
        ClassName: "DivInfoView",
        Properties: AssignProporties(OrderBaseInfo, GetProperties())
    }

    if (!_IsNoGet) {
        view.EventActionName = "GetOrderInfoEntityData";
        view.GetEntityDataActionType = DataActionTypes.GetOrderInfoEntityData;
    }
    else {
        view.PropertyName = "loanApplyBaseInfo";
    }
    return view;
}

function GetProperties() {
    return [
        { ...GetReadOnlyTextBox("BorrowerUser", "借款人", 1, 1), ControlType: "Search", IsEnterButton: true, EventActionName: "SearchCustomer" },
        { ...GetReadOnlyTextBox("Borrowers", "企业名称", 1, 2), ControlType: "Search", IsEnterButton: true, EventActionName: "SearchCustomer" },
        GetReadOnlyTextBox("OrderAreaName", "借款人所在地", 1, 3),
        GetReadOnlyTextBox("BorrowerAmount", "借款申请金额", 2, 1, "元"),
        GetReadOnlyTextBox("BorrowerPeriodName", "借款申请期限", 2, 2),
        GetReadOnlyTextBox("BackMethodName", "还款方式", 2, 3),
        GetReadOnlyTextBox("BorrowerUseName", "借款用途", 3, 1),
        GetReadOnlyTextBox("ProductType", "产品类型", 3, 2),
        GetReadOnlyTextBox("LoanUser", "信贷员", 3, 3)
    ]
}

function GetReadOnlyTextBox(Name, Label, X, Y, addonAfter) {
    return {
        ...GetTextBox(Name, Label, "", X, Y, "", 200),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsReadOnly: true,
        AddonAfter: addonAfter,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}