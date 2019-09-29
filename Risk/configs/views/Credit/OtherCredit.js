const Credit = require("../../entities/Credit");

const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;

    return {
        Name: "OtherCredit",
        Type: "View",
        Properties: AssignProporties({ Name: "OtherCredit" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "OtherCredit2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        Title: "其他数据",
        Style: { marginTop: 8 },
        PropertyName: "otherInfo",
        DefaultEditData: { ViewName: "otherInfo" },
        SaveEntityDataActionType: DataActionTypes.SaveCreditInfo,
        Properties: AssignProporties(Credit, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "OtherCreditButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "OtherCredit" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SaveOtherCredit", "保存", "primary"), Text2: "修改", IsDisabled: true, EventActionName: "SaveOtherCredit", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetTextBox3("ForeignGuaranteeAmount", "企业+个人当前对外担保金额", 2, 1, "float", "请输入", 20, false, "万元"),
        GetTextBox3("ForeignGuaranteeCount", "企业+个人当前对外担保笔数", 2, 2, "int", "请输入", 10, false, "笔数"),
        GetTextBox3("QueryCountOneMonth", "查询次数（最近1个月内）", 2, 3, "int", "请输入", 10, false, "次"),
        GetTextBox3("QueryCountTwoMonth", "查询次数（最近2个月内）", 3, 1, "int", "请输入", 10, false, "次")
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
        ReadRightName: "OtherCreditButtonView",
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