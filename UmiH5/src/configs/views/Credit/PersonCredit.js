import Credit from "../../entities/Credit";

import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";

var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "PersonCredit",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "PersonCredit2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "个人类征信",
        Style: { marginTop: 8 },
        PropertyName: "PersonCredit",
        DefaultEditData: { ViewName: "PersonCredit" },
        SaveEntityDataActionType: DataActionTypes.SaveCreditInfo,
        Properties: AssignProporties(Credit, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "PersonCreditButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SavePersonCredit", "保存", "primary"), IsDisabled: true, EventActionName: "SavePersonCredit", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetTextBox3("PersonDebtBalanceNoEquals", "个人当前抵押+质押贷款负债余额（非等额本息）", 2, 1, "float", "请输入", 20, false, "元"),
        GetTextBox3("PersonDebtBalance", "个人当前抵押+质押贷款负债余额（等额本息）", 2, 2, "float", "请输入", 20, false, "元"),
        GetTextBox3("PersonCreditBalanceNoEquals", "个人信用贷款负债余额（非等额本息）", 2, 3, "float", "请输入", 20, false, "元"),
        GetTextBox3("PersonCreditBalance", "个人信用贷款负债余额（等额本息）", 3, 1, "float", "请输入", 20, false, "元"),
        GetTextBox3("PersonRepaymentAvgSixAmount", "个人贷款平均还款金额（近6个月）", 3, 2, "float", "请输入", 20, false, "元"),
        GetTextBox3("PersonTotalCreditQuota", "个人贷记卡总授信额度", 3, 4, "float", "请输入", 20, false, "元"),
        GetTextBox3("PersonUsedCreditQuota", "个人贷记卡已使用额度", 4, 1, "float", "请输入", 20, false, "元"),
        GetTextBox3("PersonUsedAvgSixCreditQuota", "个人贷记卡平均使用额度（近6个月）", 4, 1, "float", "请输入", 20, false, "元")
    ]
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 21,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsEdit: true,
        ReadRightName: "PersonCreditButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType
    }
}