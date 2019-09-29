const Supplier = require("../../entities/Supplier");
const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

//进销管理/供应商编辑 2000-2099
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2000,
    //保存实体数据
    SaveEntityData: 2001
}

const Entity = { Name: Supplier.Name, PrimaryKey: Supplier.PrimaryKey }

module.exports = {
    Name: "SupplierEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "SupplierEdit" }, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "SupplierEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(Supplier, GetProperties())
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
        GetTextBox2("Name", "名称", 1, 1, "", "请输入名称", 50, false),
        GetTextBox2("CompanyName", "公司名称", 2, 1, "", "", 50, true),
        GetTextBox2("Linkman", "联系人", 3, 1, "", "", 50, true),
        GetTextBox2("Phone", "手机", 4, 1, "", "", 50, true),
        GetTextBox2("Telephone", "电话", 5, 1, "", "", 50, true),
        GetTextBox2("Fax", "传真", 6, 1, "", "", 50, true),
        GetTextBox2("Address", "地址", 7, 1, "", "", 200, true),
        GetTextArea("Remark", "备注", 8, 1),
        GetButtonView()
    ]
}

function GetButtonView() {
    return {
        Name: "ButtonView",
        Type: "View",
        ClassName: "DivCenterButton",
        IsDiv: true,
        IsFormItem: true,
        ColSpan: 24,
        X: 9,
        Y: 1,
        Properties: AssignProporties({ Name: "SupplierEdit" }, GetButtonProperties())
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
        PageUrl: "/PurchaseSaleManage/SupplierList"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "SupplierEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "SupplierEdit2"
    }]
}