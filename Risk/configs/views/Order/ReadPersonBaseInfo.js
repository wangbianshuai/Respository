const PersonBaseInfo = require("../../entities/PersonBaseInfo");

const { AssignProporties, GetTextBox, GetButton, GetSelect } = require("../../Common");

var DataActionTypes = {}

module.exports = (actionTypes) => {
    DataActionTypes = actionTypes;
    return {
        Name: "PersonBaseInfo",
        Type: "View",
        Properties: AssignProporties({ Name: "PersonBaseInfo" }, [GetInfoView(), GetRightButtonView()])
    }
}

function GetInfoView() {
    return {
        Name: "PersonBaseInfo2",
        Type: "RowsColsView",
        Entity: PersonBaseInfo,
        IsForm: true,
        LabelAlign: "left",
        Title: "个人基本信息",
        Style: { marginTop: 8 },
        PropertyName: "personalBase",
        DefaultEditData: { ViewName: "personalBase" },
        SaveEntityDataActionType: DataActionTypes.SaveApprovalOrderDetail,
        Properties: AssignProporties(PersonBaseInfo, GetProperties())
    }
}

function GetRightButtonView() {
    return {
        Name: "PersonBaseInfoButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({ Name: "PersonBaseInfo" }, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SavePersonBaseInfo", "保存", "primary"), Text2: "修改", EventActionName: "SavePersonBaseInfoEntityData", Style: { marginRight: 36, width: 84 } }]
}

function GetProperties() {
    return [
        GetReadOnlyTextBox("Phone", "常用手机号（非注册手机号）", 1, 1),
        GetReadOnlyTextBox("Email", "邮箱地址", 1, 2),
        GetReadOnlySelect("Educational", "教育程度", PersonBaseInfo.EducationalDataSource, 1, 3),
        GetReadOnlySelect("MaritalStatus", "婚姻状况", PersonBaseInfo.MaritalStatusDataSource, 2, 1),
        GetReadOnlyTextBox("MaritalYears", "已婚年限", 2, 2, "年"),
        GetReadOnlyTextBox("NowAddress", "现居住地址", 2, 3),
        GetReadOnlySelect("HouseStatus", "居住地是否租赁", PersonBaseInfo.HouseStatusDataSource, 3, 1),
        GetReadOnlyTextBox("HousePeriod", "租赁有效期限", 3, 2),
        GetReadOnlyTextBox("ElectricityCode", "居住地电费单号", 3, 3),
        { Name: "WhiteSpace1", Type: "WhiteSpace", ClassName: "WhiteSpace1", Style: { marginBottom: 20 }, X: 5, Y: 1, ColSpan: 24 },
        GetTextArea("ApprovalRemark", "备注", 6, 1, "请输入备注")
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

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y, PlaceHolder),
        IsFormItem: true,
        IsNullable: true,
        IsColon: false,
        IsAddOptional: true,
        IsEdit: true,
        ReadRightName: "PersonBaseInfoButtonView",
        ColSpan: 24,
        Rows: 4,
        LabelCol: 10,
        WrapperCol: 23,
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
        LabelCol: 20,
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