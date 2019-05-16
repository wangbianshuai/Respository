import Order from "../../entities/Order";

import { AssignProporties, GetTextBox, GetSelect, GetButton } from "../../pages/Common";

export default {
    Name: "OrderBaseInfo",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "OrderInfo",
        Type: "RowsColsView",
        Entity: Order,
        IsForm: true,
        LabelAlign: "left",
        Title: "工单编号-#{OrderCode}",
        Style: { marginTop: 8 },
        Properties: AssignProporties(Order, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "RightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties(Order, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveOrderBaseInfo", "保存", "primary"), EventActionName: "SaveOrderBaseInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("Borrowers", "借款主体", 1, 1),
        GetReadOnlyTextBox("BorrowerUser", "主借人", 1, 2),
        GetReadOnlyTextBox("BorrowerDate", "借款申请时间", 1, 3),
        GetReadOnlyTextBox("BorrowerAmount", "借款申请金额", 2, 1, "元"),
        GetReadOnlyTextBox("BorrowerPeriod", "借款申请期限", 2, 2, "个月"),
        GetReadOnlyTextBox("BackMethod", "还款方式", 2, 3),
        GetTextBox2("BorrowerUse", "借款用途", 3, 1, "", "请输入借款用途", 100, false),
        GetEditSelect("ProductType", "产品类型", GetProductTypeDataSource(), 3, 2, false, "请选择产品类型"),
        GetReadOnlyTextBox("LoanUser", "信贷员", 3, 3),
        GetReadOnlyTextBox("BorrowChannel", "借款申请渠道", 4, 1)
    ]
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsEdit: true,
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

function GetProductTypeDataSource() {
    return [{ Value: 1, Text: "新商贷 / ME" }, { Value: 2, Text: "新商贷2 / ME2" }]
}