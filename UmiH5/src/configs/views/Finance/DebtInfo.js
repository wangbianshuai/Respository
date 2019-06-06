import DebtInfo from "../../entities/DebtInfo";

import { AssignProporties, GetTextBox, GetButton } from "../../pages/Common";


var DataActionTypes = {}

export default (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "DebtInfo",
        Type: "View",
        Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "DebtInfo2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "负债信息",
        Style: { marginTop: 8 },
        PropertyName: "DebtInfo",
        DefaultEditData: { ViewName: "DebtInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveFinalBaseInfo,
        Properties: AssignProporties(DebtInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "DebtInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [
        { ...GetButton("SaveDebtInfo", "保存", "primary"), EventActionName: "SaveDebtInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetTextBox3("DebtTotalBalance", "非银行机构负债总余额", 1, 1, "float", "请输入", 20, false, "元"),
        GetTextBox3("LoanTotalAmountThreeMonth", "到期信用类贷款总额（近3个月）", 1, 2, "float", "请输入", 20, false, "元"),
        GetTextBox3("BankLoanReduceAmountThreeMonth", "银行贷款减少总额（近3个月）", 1, 3, "float", "请输入", 20, false, "元"),
        GetTextBox3("DebtCount", "隐性负债笔数", 2, 1, "int", "请输入", 10, false, "笔"),
        GetTextBox3("DebtRepaymentMonthAmount", "隐性负债月还款额", 2, 2, "float", "请输入", 20, false, "元")
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