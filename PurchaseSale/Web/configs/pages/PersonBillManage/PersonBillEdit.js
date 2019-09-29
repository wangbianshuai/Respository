const PersonBill = require("../../entities/PersonBill");
const { AssignProporties, GetTextBox, GetButton, GetRadio, GetDatePicker, GetSelect } = require("../../Common");

//个人记账/个人收支编辑 1800-1899
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 1800,
    //保存实体数据
    SaveEntityData: 1801
}

const Entity = { Name: PersonBill.Name, PrimaryKey: PersonBill.PrimaryKey }

module.exports = {
    Name: "PersonBillEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "PersonBillEdit" }, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "PersonBillEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(PersonBill, GetProperties())
    }
}

function GetButtonProperties() {
    return [{
        Name: "LeftSpace1",
        Type: "WhiteSpace",
        ClassName: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...GetButton("SaveEntityData", "保存", "primary"), EventActionName: "SaveEntityData", Style: { width: 84 } },
    { ...GetButton("BackToLast", "返回", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 } }]
}

function GetProperties() {
    return [
        GetIncomePayment(),
        { ...GetEditSelect("BillTypeId", "类型", PersonBill.PersonTypeDataSource, 2, 1, false, "请选择类型") },
        { ...GetTextBox2("Amount", "金额", 3, 1, "", "请输入金额", 20, false), DataType: "float" },
        GetDatePicker2("BillDate", "日期", 4, 1, "", "请选择日期", 10, false),
        GetTextArea("Remark", "备注", 5, 1),
        GetButtonView()
    ]
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, null, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 8,
        IsNullable,
        IsEdit: true,
        ServiceDataSource: DataSource,
        PlaceHolder: PlaceHolder
    }
}

function GetDatePicker2(Name, Label, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsFormItem: true, ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 8,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        IsCurrentDay: true
    }
}

function GetIncomePayment() {
    return {
        ...GetRadio("IncomePayment", "收支", PersonBill.IncomePaymentDataSource, 1, 1, 1, 160),
        IsFormItem: true,
        ColSpan: 24,
        IsLoadValue: true,
        LabelCol: 8,
        WrapperCol: 8,
        IsEdit: true
    }
}

function GetButtonView() {
    return {
        Name: "ButtonView",
        Type: "View",
        ClassName: "DivCenterButton",
        IsDiv: true,
        IsFormItem: true,
        ColSpan: 24,
        X: 6,
        Y: 1,
        Properties: AssignProporties({ Name: "PersonBillEdit" }, GetButtonProperties())
    }
}

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsEdit: true,
        ColSpan: 24,
        Rows: 3,
        PlaceHolder,
        LabelCol: 8,
        WrapperCol: 8
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, IsVisible, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        ValidateNames, ValidateTipMessage,
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 8,
        IsNullable,
        IsVisible,
        IsEdit: true
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/ProductManage/PersonBillList"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PersonBillEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "PersonBillEdit2"
    }]
}