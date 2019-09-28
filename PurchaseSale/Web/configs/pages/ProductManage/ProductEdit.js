const Product = require("../../entities/Product");
const { AssignProporties, GetTextBox, GetButton, GetSelect } = require("../../Common");

//商品管理/商品编辑 1000-1099
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 1000,
    //保存实体数据
    SaveEntityData: 1001
}

const Entity = { Name: Product.Name, PrimaryKey: Product.PrimaryKey }

module.exports = {
    Name: "ProductEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "ProductEdit" }, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "ProductEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(Product, GetProperties())
    }
}

function GetButtonProperties() {
    return [{
        Name: "LeftSpace1",
        Type: "WhiteSpace",
        ClassName: "ant-col ant-col-3 ant-form-item-label",
    },
    { ...GetButton("SaveEntityData", "保存", "primary"), EventActionName: "SaveEntityData", Style: { width: 84 } },
    { ...GetButton("BackToLast", "返回", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 } }]
}

function GetProperties() {
    return [
        GetLeftWhite("LeftSpace11", 1, 1),
        GetTextBox2("Name", "名称", 1, 2, "", "请输入名称", 50, false),
        GetTextBox2("ProductCode", "编号", 1, 3, "", "请输入编号", 50, false),
        GetLeftWhite("LeftSpace13", 2, 1),
        GetEditSelect("ProductTypeId", "类型", GetProductTypeDataSource(), 2, 2, false, "请选择类型"),
        GetEditSelect("ProductBrandId", "品牌", GetProductBrandDataSource(), 2, 3, false, "请选择品牌"),
        GetLeftWhite("LeftSpace13", 3, 1),
        { ...GetTextBox2("InitStock", "初始库存", 3, 2, "", "请输入初始库存", 20, false), DataType: "float" },
        GetEditSelect("Unit", "单位", GetUnitDataSource(), 3, 3, false, "请选择单位"),
        GetLeftWhite("LeftSpace14", 4, 1),
        { ...GetTextBox2("BidPrice", "进价", 4, 2, "", "请输入进价", 20, false), DataType: "float" },
        { ...GetTextBox2("SillingPrice", "售价", 4, 3, "", "请输入售价", 20, false), DataType: "float" },
        GetLeftWhite("LeftSpace15", 5, 1),
        GetTextArea("Model", "型号", 5, 2),
        GetLeftWhite("LeftSpace16", 6, 1),
        GetTextArea("Spec", "规格", 6, 2),
        GetLeftWhite("LeftSpace17", 7, 1),
        GetTextArea("Remark", "说明", 7, 2),
        GetLeftWhite("LeftSpace11", 8, 1),
        GetButtonView()
    ]
}


function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, null, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 6,
        LabelCol: 6,
        WrapperCol: 18,
        IsNullable,
        IsEdit: true,
        ServiceDataSource: DataSource,
        PlaceHolder: PlaceHolder
    }
}

function GetProductTypeDataSource() {
    return {
        ValueName: "Id",
        TextName: "Name",
        StateName: "ProductTypes",
        ServiceName: "ProductService",
        ActionName: "GetProductTypes",
        IsRefresh: true,
        Payload: {}
    }
}

function GetProductBrandDataSource() {
    return {
        ValueName: "Id",
        TextName: "Name",
        StateName: "ProductBrands",
        ServiceName: "ProductService",
        ActionName: "GetProductBrands",
        IsRefresh: true,
        Payload: {}
    }
}

function GetUnitDataSource() {
    return {
        ValueName: "Value",
        TextName: "Value",
        StateName: "Units",
        ServiceName: "ProductService",
        ActionName: "GetUnits",
        IsRefresh: true,
        Payload: {}
    }
}

function GetLeftWhite(Name, X, Y) {
    return {
        Name,
        Type: "WhiteSpace",
        IsFormItem: true,
        ColSpan: 6,
        X, Y
    }
}

function GetButtonView() {
    return {
        Name: "ButtonView",
        Type: "View",
        ClassName: "DivCenterButton",
        IsDiv: true,
        IsFormItem: true,
        ColSpan: 12,
        X: 8,
        Y: 2,
        Properties: AssignProporties({ Name: "ProductEdit" }, GetButtonProperties())
    }
}

function GetTextArea(Name, Label, X, Y, PlaceHolder, MaxLength) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y, PlaceHolder, MaxLength),
        IsFormItem: true,
        IsNullable: true,
        IsEdit: true,
        ColSpan: 12,
        Rows: 3,
        LabelCol: 3,
        WrapperCol: 21
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, IsVisible, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        ValidateNames, ValidateTipMessage,
        IsFormItem: true,
        ColSpan: 6,
        LabelCol: 6,
        WrapperCol: 18,
        IsNullable,
        IsVisible,
        IsEdit: true
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/ProductManage/ProductList"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "ProductEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "ProductEdit2"
    }]
}