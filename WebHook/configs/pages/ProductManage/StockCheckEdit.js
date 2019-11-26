const StockCheck = require("../../entities/StockCheck");
const { AssignProporties, GetTextBox, GetButton, GetDatePicker, GetSelect } = require("../../Common");

//商品管理/库存盘点 1400-1499
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 1400,
    //保存实体数据
    SaveEntityData: 1401
}

const Entity = { Name: StockCheck.Name, PrimaryKey: StockCheck.PrimaryKey }

module.exports = {
    Name: "StockCheckEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "StockCheckEdit" }, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "StockCheckEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(StockCheck, GetProperties())
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
        GetSelectProductProperty(),
        GetReadOnlyTextBox2("BidPrice", "进价", 2, 1),
        GetReadOnlyTextBox2("CurrentStock", "应有库存", 3, 1),
        { ...GetTextBox2("RealStock", "实有库存", 4, 1, "", "请输入实有库存", 20, false), DataType: "float" },
        GetDatePicker2("CheckDate", "盘点日期", 5, 1, "", "请选择盘点日期", 10, false),
        { ...GetEditSelect("CheckUser", "盘点员", StockCheck.UserDataSource, 6, 1, false, "请选择盘点人"), IsCurrentUser: true },
        GetTextArea("Remark", "备注", 7, 1),
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


function GetSelectProductProperty() {
    return {
        Name: "ProductId",
        Type: "Select",
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 8,
        IsEdit: true,
        Label: "商品",
        IsSearch: true,
        IsNullable: false,
        X: 1,
        Y: 1,
        IsLoadValue: true,
        PlaceHolder: "请输入商品编号或名称关键字",
        SelectDataToProperties: ["CurrentStock", "BidPrice"],
        ServiceDataSource: GetProductDataSource()
    }
}

function GetProductDataSource() {
    return {
        ValueName: "Id",
        TextName: "ProductName",
        StateName: "ProductList",
        ServiceName: "StockCheckService",
        ActionName: "GetProductList",
        IsRefresh: true,
        Payload: {}
    }
}

function GetReadOnlyTextBox2(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "", X, Y),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 8,
        IsReadOnly: true,
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
        X: 8,
        Y: 1,
        Properties: AssignProporties({ Name: "StockCheckEdit" }, GetButtonProperties())
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
        PageUrl: "/ProductManage/StockCheckList"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "StockCheckEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "StockCheckEdit2"
    }]
}