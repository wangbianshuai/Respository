const Sale = require("../../entities/Sale");
const SaleDetail = require("../../entities/SaleDetail");
const { AssignProporties, GetTextBox, CreateGuid } = require("../../Common");

//进销管理/销售单列表
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2605
}

const Entity = { Name: "ViewSale", PrimaryKey: Sale.PrimaryKey }
const DetailEntity = { Name: SaleDetail.Name, PrimaryKey: SaleDetail.PrimaryKey }

module.exports = {
    Id: CreateGuid(),
    DialogId: CreateGuid(),
    Name: "LookSaleView",
    Entity: Entity,
    Type: "View",
    DialogWidth: 1200,
    DialogTitle: "销售单",
    DialogStyle: { maxHeight: 600, overflow: "auto" },
    BodyStyle: { padding: "0 16px", margin: 0 },
    Properties: AssignProporties({ Name: "SaleEdit" }, [GeEditView()])
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

function GetProperties() {
    return [
        GetTextBox2("SaleCode", "销售单号", 1, 1, "", "", 20),
        GetTextBox2("SaleTypeName", "销售类型", 1, 2, "", "", 20),
        GetTextBox2("SaleAmount", "商品金额", 2, 1, "", "", 20),
        GetTextBox2("BidAmount", "商品成本", 2, 2, "", "", 20),
        GetTextBox2("Profit", "商品利润", 3, 1, "", "", 20),
        GetTextBox2("ProfitRate", "利润率(%)", 3, 2, "", "", 20),
        GetTextBox2("LogisticsFee", "物流费", 4, 1, "", "", 10),
        GetTextBox2("OtherFee", "其他费用", 4, 2, "", "", 10),
        GetTextBox2("DiscountFee", "折扣", 5, 1, "", "", 10),
        GetTextBox2("ShouldAmount2", "应收金额", 5, 2, "", "", 20),
        GetTextBox2("RealAmount2", "实收金额", 6, 1, "", "", 10),
        GetTextBox2("DueAmount", "待收金额", 6, 2, "", "", 10),
        GetTextBox2("CustomerName", "顾客姓名", 7, 1, "", "", 50),
        GetTextBox2("CustomerPhone", "顾客手机", 7, 2, "", "", 11),
        GetTextBox2("SaleDate", "销售日期", 8, 1, "", 10),
        GetTextBox2("SaleUserName", "销售员", 8, 2, "", 20),
        GetTextArea("Remark", "备注", 9, 1),
        GetDataGridView()
    ]
}

function GetDataGridView() {
    return {
        Name: "Details",
        Entity: DetailEntity,
        Type: "DataGridView",
        ColSpan: 24,
        IsDiv: true,
        X: 12,
        Y: 1,
        IsClear: true,
        IsEdit: true,
        IsComplexEntity: true,
        IsPaging: false,
        ClassName: "DivInfoView3",
        Style: { marginBottom: 16 },
        Properties: AssignProporties(SaleDetail, ["ProductName", "ProductTypeName", "ProductBrandName", "SillingPrice", "Number", "Unit", "Amount"])
    }
}

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsEdit: true,
        IsReadOnly: true,
        IsClear: true,
        ColSpan: 12,
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
        ColSpan: 12,
        LabelCol: 4,
        IsClear: true,
        WrapperCol: 20,
        IsNullable,
        IsVisible,
        IsReadOnly: true,
        IsEdit: true
    }
}