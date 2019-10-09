const Sale = require("../../entities/Sale");
const SaleDetail = require("../../entities/SaleDetail");
const { AssignProporties, GetTextBox, GetButton, GetRadio, GetDatePicker, GetSelect } = require("../../Common");

//进销管理/销售单录入 2500-2599
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2500,
    //保存实体数据
    SaveEntityData: 2501,
    //保存实体数据
    SumbitEntityData: 2502,
    //添加明细
    AddDetail: 2503
}

const Entity = { Name: Sale.Name, PrimaryKey: Sale.PrimaryKey }
const DetailEntity = { Name: SaleDetail.Name, PrimaryKey: SaleDetail.PrimaryKey }

module.exports = {
    Name: "SaleEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "SaleEdit" }, [GetDetailEditView(), GeEditView()])
}

function GeEditView() {
    return {
        Name: "SaleEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(Sale, GetProperties())
    }
}

function GetDetailEditView() {
    return {
        Name: "DetailEditView",
        Type: "RowsColsView",
        Entity: DetailEntity,
        IsForm: true,
        IsClear: true,
        GetEntityDataActionType: DataActionTypes.AddDetail,
        Properties: AssignProporties(SaleDetail, GetDetailProperties())
    }
}

function GetButtonProperties() {
    return [{
        Name: "LeftSpace1",
        Type: "WhiteSpace",
        ClassName: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...GetButton("SumbitEntityData", "提交", "primary"), EventActionName: "SaveEntityData", SaveEntityDataActionType: DataActionTypes.SumbitEntityData, Icon: "save" },
    { ...GetButton("SaveEntityData", "保存", ""), EventActionName: "SaveEntityData", SaveEntityDataActionType: DataActionTypes.SaveEntityData, Icon: "save", Style: { marginLeft: 10 } },
    { ...GetButton("BackToLast", "返回", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 }, Icon: "left", }]
}

function GetDetailProperties() {
    return [
        {
            ...GetEditSelect("ProductId", "商品", Sale.ProductDataSource, 1, 1, false, "请输入商品编号或名称关键字"),
            IsLoadValue: true,
            PlaceHolder: "请输入商品编号或名称关键字",
            SelectDataToProperties: ["SillingPrice"],
        },
        { ...GetTextBox2("SillingPrice", "价格", 2, 1, "", "请输入价格", 10, false), DataType: "float" },
        { ...GetTextBox2("Number", "数量", 4, 1, "", "请输入数量", 8, false), DataType: "float", DefaultValue: 1 },
        { ...GetButton("AddDetail", "添加", "primary"), EventActionName: "AddDetail", X: 4, Y: 2, Icon: "plus", IsFormItem: true }
    ]
}

function GetProperties() {
    return [
        GetDataGridView(),
        GetSaleType(),
        { ...GetTextBox2("SumAmount", "商品金额", 6, 1, "", "", 20, true), DataType: "float", IsReadOnly: true },
        { ...GetTextBox2("LogisticsFee", "物流费", 6, 2, "", "", 10, true), DataType: "float" },
        { ...GetTextBox2("OtherFee", "其他费用", 7, 1, "", "", 10, true), DataType: "float" },
        { ...GetTextBox2("DiscountFee", "折扣", 7, 2, "", "", 10, true), DataType: "float" },
        { ...GetTextBox2("ShouldAmount", "应收金额", 8, 1, "", "", 20, true), DataType: "float", IsReadOnly: true },
        { ...GetTextBox2("RealAmount", "实收金额", 8, 2, "", "", 10, true), DataType: "float" },
        GetTextBox2("CustomerName", "顾客姓名", 9, 1, "", "", 50, true),
        GetTextBox2("CustomerPhone", "顾客手机", 9, 2, "", "", 11, true),
        GetDatePicker2("SaleDate", "日期", 10, 1, "", "请选择日期", 10, false),
        { ...GetEditSelect("SaleUser", "销售员", Sale.UserDataSource, 10, 2, false, "请选择销售员"), IsCurrentUser: true },
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
        ClassName: "DivInfoView3",
        Style: { marginBottom: 16 },
        Properties: AssignProporties(SaleDetail, ["ProductName", "ProductTypeName", "ProductBrandName", "SillingPrice", "Discount", "Number", "Unit", "Amount"])
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

function GetSaleType() {
    return {
        ...GetRadio("SaleType", "销售类型", Sale.SaleTypeDataSource, 5, 1, 1, "50%"),
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
        Properties: AssignProporties({ Name: "SaleEdit" }, GetButtonProperties())
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
        PageUrl: "/PurchaseSaleManage/SaleList"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "SaleEdit2"
    },
    {
        Name: "AddDetail",
        Type: "EntityEdit/SaveEntityData",
        EditView: "DetailEditView",
        ExpandSetEntityData: "SetDetailEntityData"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "SaleEdit2"
    }]
}