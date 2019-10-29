const Purchase = require("../../entities/Purchase");
const PurchaseDetail = require("../../entities/PurchaseDetail");
const { AssignProporties, GetTextBox, CreateGuid } = require("../../Common");

//进销管理/采购单列表
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2905
}

const Entity = { Name: "ViewPurchase", PrimaryKey: Purchase.PrimaryKey }
const DetailEntity = { Name: PurchaseDetail.Name, PrimaryKey: PurchaseDetail.PrimaryKey }

module.exports = {
    Id: CreateGuid(),
    DialogId: CreateGuid(),
    Name: "LookPurchaseView",
    Entity: Entity,
    Type: "View",
    DialogWidth: 1200,
    DialogTitle: "采购单",
    DialogStyle: { maxHeight: 600, overflow: "auto" },
    BodyStyle: { padding: "0 16px", margin: 0 },
    Properties: AssignProporties({ Name: "PurchaseEdit" }, [GeEditView()])
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

function GetProperties() {
    return [
        GetTextBox2("PurchaseCode", "采购单号", 1, 1, "", "", 20),
        GetTextBox2("PurchaseTypeName", "采购类型", 1, 2, "", "", 20),
        GetTextBox2("PurchaseAmount", "商品金额", 2, 1, "", "", 20),
        GetTextBox2("LogisticsFee", "物流费", 2, 2, "", "", 10),
        GetTextBox2("OtherFee", "其他费用", 3, 1, "", "", 10),
        GetTextBox2("DiscountFee", "折扣", 3, 2, "", "", 10),
        GetTextBox2("ShouldAmount2", "应付金额", 4, 1, "", "", 20),
        GetTextBox2("RealAmount2", "实付金额", 4, 2, "", "", 10),
        GetTextBox2("DueAmount", "待付金额", 5, 1, "", "", 10),
        GetTextBox2("SupplierName", "供应商", 5, 2, "", "", 50),
        GetTextBox2("PurchaseDate", "采购日期", 8, 1, "", 10),
        GetTextBox2("PurchaseUserName", "采购员", 8, 2, "", 20),
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
        Properties: AssignProporties(PurchaseDetail, ["ProductName", "ProductTypeName", "ProductBrandName", "BidPrice", "Number", "Unit", "Amount"])
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