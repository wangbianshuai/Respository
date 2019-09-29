const DealInfo = require("../../entities/DealInfo");

const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "DealInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "DealInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "DealInfo2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "经营信息",
        Style: { marginTop: 8 },
        PropertyName: "businessInfo",
        DefaultEditData: { ViewName: "businessInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveFinalBaseInfo,
        Properties: AssignProporties(DealInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "DealInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "DealInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [
        { ...GetButton("SaveDealInfo", "保存", "primary"), Text2: "修改", EventActionName: "SaveDealInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetTextBox3("DownAccountPeriod", "下游账期", 1, 1, "int", "请输入", 5, false, "天"),
        GetTextBox3("CurrentInAmount", "当前应收账款", 1, 2, "float", "请输入", 20, false, "元"),
        GetTextBox3("CurrentStockAmount", "当前存货价值", 1, 3, "float", "请输入", 20, false, "元"),
        GetTextBox3("CurrentPayAmount", "当前应付账款", 2, 1, "int", "请输入", 10, false, "笔"),
        GetTextBox3("CurrentOtherPayAmount", "当前其他应付账款", 2, 2, "float", "请输入", 20, false, "元"),
        GetTextBox3("IndustryProfitRate", "行业利润率", 2, 3, "float", "请输入", 6, false, "%", 0, 100)
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
        ReadRightName: "DealInfoButtonView",
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter, MinValue, MaxValue) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType, MinValue, MaxValue
    }
}