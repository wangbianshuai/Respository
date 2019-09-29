const BankRecord = require("../../entities/BankRecord");

const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "CollectBankInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "CollectBankInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "CollectBankInfo2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "汇总数据",
        Style: { marginTop: 8 },
        Entity: BankRecord,
        PropertyName: "financeFlowSum",
        DefaultEditData: { ViewName: "financeFlowSum" },
        GetEntityDataActionType: DataActionTypes.ComputeCollectBankInfo,
        Properties: AssignProporties(BankRecord, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "CollectBankInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "CollectBankInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [
        { ...GetButton("Compute", "计算", "primary"), IsDisabled: true, EventActionName: "ComputeCollectBankInfo", Style: { marginRight: 10, width: 84 } },
        { ...GetButton("SaveCollectBankInfo", "保存", "primary"), Text2: "修改", IsDisabled: true, SaveEntityDataActionType: DataActionTypes.SaveCompanyFinanceInfo, EventActionName: "SaveCollectBankInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetTextBox3("TotalCompanyMonthAmount", "对公月均流水", 2, 1, "float", "请输入对公月均流水", 20, false, "元"),
        GetTextBox3("TotalPersonMonthAmount", "对私月均流水", 2, 2, "float", "请输入对私月均流水", 20, false, "元"),
        GetTextBox3("TotalMonthAmount", "总月均流水", 2, 3, "float", "请输入总月均流水", 20, false, "元"),
        GetTextBox3("TotalMonthInterest", "累计结息", 3, 1, "float", "请输入累计结息", 20, false, "元"),
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
        ReadRightName: "CollectBankInfoButtonView",
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
        DataType,
        IsReadOnly: true
    }
}