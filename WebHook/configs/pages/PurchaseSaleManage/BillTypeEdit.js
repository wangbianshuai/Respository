const BillType = require("../../entities/BillType");
const { AssignProporties, GetTextBox, GetButton, GetRadio } = require("../../Common");

//进销管理/账目类型编辑 2200-2299
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2200,
    //保存实体数据
    SaveEntityData: 2201
}

const Entity = { Name: BillType.Name, PrimaryKey: BillType.PrimaryKey }

module.exports = {
    Name: "BillTypeEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "BillTypeEdit" }, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "BillTypeEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(BillType, GetProperties())
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
        GetTextBox2("Name", "名称", 2, 1, "", "请输入名称", 50, false),
        GetTextArea("Remark", "备注", 3, 1),
        GetButtonView()
    ]
}

function GetIncomePayment() {
    return {
        ...GetRadio("IncomePayment", "收支", BillType.IncomePaymentDataSource, 1, 1, 2, "50%"),
        IsFormItem: true,
        ColSpan: 24,
        IsLoadValue: true,
        LabelCol: 8,
        WrapperCol: 8,
        Style: { width: "100%" },
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
        Properties: AssignProporties({ Name: "BillTypeEdit" }, GetButtonProperties())
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
        PageUrl: "/PurchaseSaleManage/BillTypeList"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "BillTypeEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "BillTypeEdit2"
    }]
}