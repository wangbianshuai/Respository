const Bill = require("../../entities/Bill");
const { AssignProporties, GetTextBox, GetButton, GetRadio, GetDatePicker, GetSelect } = require("../../Common");

//进销管理/收支明细编辑 2400-2499
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2400,
    //保存实体数据
    SaveEntityData: 2401
}

const Entity = { Name: Bill.Name, PrimaryKey: Bill.PrimaryKey }

module.exports = {
    Name: "BillEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "BillEdit" }, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "BillEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(Bill, GetProperties())
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
        {
            ...GetEditSelect("BillTypeId", "类型", Bill.PersonTypeDataSource, 2, 1, false, "请选择类型"),
            ParentName: "IncomePayment", ParentPropertyName: "IncomePayment", IsLoadValue: true
        },
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
        ...GetRadio("IncomePayment", "收支", Bill.IncomePaymentDataSource, 1, 1, 2, "50%"),
        IsFormItem: true,
        ColSpan: 24,
        IsLoadValue: true,
        LabelCol: 8,
        WrapperCol: 8,
        Style: { width: "100%" },
        ChildNames: ["BillTypeId"],
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
        Properties: AssignProporties({ Name: "BillEdit" }, GetButtonProperties())
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
        PageUrl: "/PurchaseSaleManage/BillList",
        ExpandSetPageUrl: "ExpandSetPageUrl"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "BillEdit2",
        ExpandSetEntityData: "ExpandSetEntityData"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "BillEdit2"
    }]
}