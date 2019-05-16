import Order from "../../entities/Order";

import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

export default {
    Name: "OrderBaseInfo",
    Type: "View",
    Properties: AssignProporties({}, [GetTitleView(), GetInfoView()])
}


function GetTitleView() {
    return {
        Name: "TitleView",
        Type: "View",
        ClassName: "DivLeftRightTitleView",
        IsDiv: true,
        Properties: AssignProporties(Order, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ Name: "Title", Type: "SpanText", ClassName: "LeftTitle", Text: "工单编号-#{OrderCode}" },
    { ...GetButton("ToOrderDetail", "进件详情", ""), Style: { marginRight: 20 } }]
}

function GetInfoView() {
    return {
        Name: "OrderInfo",
        Type: "RowsColsView",
        Entity: Order,
        IsForm: true,
        LabelAlign: "left",
        IsDiv: true,
        ClassName:"DivInfoView",
        Properties: AssignProporties(Order, GetProperties())
    }
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("Borrowers", "借款主体", 1, 1),
        GetReadOnlyTextBox("BorrowerUser", "主借人", 1, 2),
        GetReadOnlyTextBox("BorrowerDate", "借款申请时间", 1, 3),
        GetReadOnlyTextBox("BorrowerAmount", "借款申请金额", 2, 1, "元"),
        GetReadOnlyTextBox("BorrowerPeriod", "借款申请期限", 2, 2, "个月"),
        GetReadOnlyTextBox("BackMethod", "还款方式", 2, 3),
        GetReadOnlyTextBox("BorrowerUse", "借款用途", 3, 1),
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
        WrapperCol: 20,
        IsReadOnly: true,
        AddonAfter: addonAfter,
        Value: "测试数据1" + Label,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}