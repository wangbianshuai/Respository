import Order from "../../entities/Order";

import { AssignProporties, GetTextBox, GetButton, GetSelect } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "OrderBaseInfo",
        Type: "View",
        Properties: AssignProporties({}, [GetTitleView(), GetInfoView()])
    }
}

function GetTitleView() {
    return {
        Name: "TitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "Title", Type: "SpanText", ClassName: "LeftTitle", Text: "工单编号-#{OrderCode}" },
    { ...GetButton("ToOrderDetail", "进件详情", ""), EventActionName: "ToOrderDetail", Style: { marginRight: 20 } }]
}

function GetInfoView() {
    return {
        Name: "OrderInfo",
        Type: "RowsColsView",
        Entity: Order,
        IsForm: true,
        LabelAlign: "left",
        IsDiv: true,
        ClassName: "DivInfoView",
        EventActionName: "GetOrderInfoEntityData",
        GetEntityDataActionType: DataActionTypes.GetOrderInfoEntityData,
        Properties: AssignProporties(Order, GetProperties())
    }
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("BorrowerUser", "借款人", 1, 1),
        GetReadOnlyTextBox("Borrowers", "企业名称", 1, 2),
        GetReadOnlyTextBox("OrderArea", "借款人所在地", 1, 3),
        GetReadOnlyTextBox("BorrowerAmount", "借款申请金额", 2, 1, "元"),
        GetReadOnlySelect("BorrowerPeriod", "借款申请期限", Order.BorrowerPeriodDataSource, 2, 2),
        GetReadOnlySelect("BackMethod", "还款方式", Order.BackMethodDataSource, 2, 3),
        GetReadOnlySelect("BorrowerUse", "借款用途", Order.BorrowerUseDataSource, 3, 1),
        GetReadOnlyTextBox("ProductType", "产品类型", 3, 2),
        GetReadOnlyTextBox("LoanUser", "信贷员", 3, 3)
    ]
}

function GetReadOnlySelect(Name, Label, DataSource, X, Y) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 21,
        IsReadOnly: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
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