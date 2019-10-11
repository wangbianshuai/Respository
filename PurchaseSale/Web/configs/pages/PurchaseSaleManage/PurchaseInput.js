const Purchase = require("../../entities/Purchase");
const PurchaseDetail = require("../../entities/PurchaseDetail");
const { AssignProporties, GetTextBox, GetButton, GetRadio, GetDatePicker, GetSelect } = require("../../Common");

//进销管理/采购单录入 2800-2899
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2800,
    //保存实体数据
    SaveEntityData: 2801,
    //保存实体数据
    SumbitEntityData: 2802,
    //添加明细
    AddDetail: 2803
}

const Entity = { Name: Purchase.Name, PrimaryKey: Purchase.PrimaryKey, ExpandMethods: { GetEntityData: "GetPurchase", Update: "Update2", Insert: "Insert2" } }
const DetailEntity = { Name: PurchaseDetail.Name, PrimaryKey: PurchaseDetail.PrimaryKey }

module.exports = {
    Name: "PurchaseEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "PurchaseEdit" }, [GetDetailEditView(), GeEditView()])
}

function GeEditView() {
    return {
        Name: "PurchaseEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(Purchase, GetProperties())
    }
}

function GetDetailEditView() {
    return {
        Name: "DetailEditView",
        Type: "RowsColsView",
        Entity: DetailEntity,
        IsForm: true,
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.AddDetail,
        Properties: AssignProporties(PurchaseDetail, GetDetailProperties())
    }
}

function GetButtonProperties() {
    return [{
        Name: "LeftSpace1",
        Type: "WhiteSpace",
        ClassName: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...GetButton("SumbitEntityData", "提交", "primary"), EventActionName: "SubmitEntityData", SaveEntityDataActionType: DataActionTypes.SumbitEntityData, Icon: "save" },
    { ...GetButton("SaveEntityData", "保存", ""), EventActionName: "SaveEntityData", SaveEntityDataActionType: DataActionTypes.SaveEntityData, Icon: "save", Style: { marginLeft: 10 } },
    { ...GetButton("BackToLast", "返回", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 }, Icon: "left", }]
}

function GetDetailProperties() {
    return [
        {
            ...GetEditSelect("ProductId", "商品", Purchase.ProductDataSource, 1, 1, false, "请输入商品编号或名称关键字"),
            IsLoadValue: true,
            PlaceHolder: "请输入商品编号或名称关键字",
            SelectDataToProperties: ["BidPrice"],
        },
        { ...GetTextBox2("BidPrice", "价格", 2, 1, "", "请输入价格", 10, false), DataType: "float", IsLoadValue: true },
        { ...GetTextBox2("Number", "数量", 3, 1, "", "请输入数量", 8, false), DataType: "float", DefaultValue: 1, IsLoadValue: true },
        { ...GetTextBox2("Amount", "金额", 4, 1, "", "请输入金额", 20, false), DataType: "float" },
        { ...GetButton("AddDetail", "添加", "primary"), EventActionName: "AddDetail", X: 4, Y: 2, Icon: "plus", IsFormItem: true, IsComplexEntity: true }
    ]
}

function GetProperties() {
    return [
        GetDataGridView(),
        GetPurchaseType(),
        GetEditSelect("SupplierId", "供应商", Sale.SupplierDataSource, 5, 2),
        { ...GetTextBox2("SumAmount", "商品金额", 6, 1, "", "", 20, true), DataType: "float", IsReadOnly: true },
        { ...GetTextBox2("LogisticsFee", "物流费", 6, 2, "", "", 10, true), DataType: "float" },
        { ...GetTextBox2("OtherFee", "其他费用", 7, 1, "", "", 10, true), DataType: "float" },
        { ...GetTextBox2("DiscountFee", "折扣", 7, 2, "", "", 10, true), DataType: "float" },
        { ...GetTextBox2("ShouldAmount", "应付金额", 8, 1, "", "", 20, true), DataType: "float", IsReadOnly: true },
        { ...GetTextBox2("RealAmount", "实付金额", 8, 2, "", "", 10, true), DataType: "float" },
        GetDatePicker2("PurchaseDate", "日期", 10, 1, "", "请选择日期", 10, false),
        { ...GetEditSelect("PurchaseUser", "采购员", Purchase.UserDataSource, 10, 2, false, "请选择采购员"), IsCurrentUser: true },
        GetTextArea("Remark", "备注", 11, 1),
        GetButtonView()
    ]
}

function GetDataGridView() {
    return {
        Name: "Details",
        Entity: DetailEntity,
        Type: "DataGridView",
        ColSpan: 24,
        IsDiv: true,
        X: 4,
        Y: 1,
        IsEdit: true,
        IsComplexEntity: true,
        IsPaging: false,
        IsNullable: false,
        NullTipMessage: "请先添加商品！",
        DataType: "Array",
        ClassName: "DivInfoView3",
        Style: { marginBottom: 16 },
        Properties: AssignProporties(PurchaseDetail, ["ProductName", "ProductTypeName", "ProductBrandName", "BidPrice", "Number", "Unit", "Amount", GetOperation()])
    }
}

function GetOperation() {
    return {
        Name: "Operation",
        Label: "操作",
        IsData: false,
        ActionList: AssignProporties(PurchaseDetail, [GetDeleteAction()])
    }
}

function GetDeleteAction() {
    return {
        Name: "DeleteDetail",
        Label: "删除",
        EventActionName: "DeleteDetail",
        Type: "AButton"
    }
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, null, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 10,
        LabelCol: 4,
        WrapperCol: 20,
        IsNullable,
        IsEdit: true,
        ServiceDataSource: DataSource,
        PlaceHolder: PlaceHolder
    }
}

function GetDatePicker2(Name, Label, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetDatePicker(Name, Label, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 10,
        LabelCol: 4,
        WrapperCol: 20,
        IsNullable: IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        IsCurrentDay: true
    }
}

function GetPurchaseType() {
    return {
        ...GetRadio("PurchaseType", "采购类型", Purchase.PurchaseTypeDataSource, 5, 1, 1, "50%"),
        IsFormItem: true,
        ColSpan: 10,
        LabelCol: 4,
        WrapperCol: 20,
        IsLoadValue: true,
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
        X: 12,
        Y: 1,
        Properties: AssignProporties({ Name: "PurchaseEdit" }, GetButtonProperties())
    }
}

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsEdit: true,
        ColSpan: 10,
        LabelCol: 4,
        WrapperCol: 20,
        Rows: 3,
        PlaceHolder
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, IsVisible, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        ValidateNames, ValidateTipMessage,
        IsFormItem: true,
        ColSpan: 10,
        LabelCol: 4,
        WrapperCol: 20,
        IsNullable,
        IsVisible,
        IsEdit: true
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/PurchaseSaleManage/PurchaseList"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PurchaseEdit2",
    },
    {
        Name: "SubmitEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PurchaseEdit2",
        SuccessCallback: "SubmitEntityDataCallback"
    },
    {
        Name: "AddDetail",
        Type: "EntityEdit/SaveEntityData",
        EditView: "DetailEditView",
        ExpandSetEntityData: "SetDetailEntityData",
        SuccessCallback: "SetDetailEntityDataCallback"
    },
    {
        Name: "DeleteDetail",
        Type: "DataListView/Remove",
        DataListView: "Details"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "PurchaseEdit2"
    }]
}