const ProductRate =require( "../../entities/ProductRate");
const { AssignProporties, GetTextBox, GetSelect, GetButton } =require( "../../Common");

//公共配置/产品利率编辑 3400-3499
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3400,
    //保存实体数据
    SaveEntityData: 3401
}

module.exports= {
    Name: "ProductRateEdit",
    Type: "View",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"ProductRateEdit"}, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "ProductRateEdit2",
        Type: "RowsColsView",
        Entity: ProductRate,
        IsForm: true,
        IsClear: true,
        EventActionName: "GetEntityData",
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(ProductRate, GetProperties())
    }
}

function GetButtonProperties() {
    return [{
        Name: "LeftSpace1",
        Type: "WhiteSpace",
        ClassName: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...GetButton("SaveEntityData", "提交", "primary"), EventActionName: "SaveEntityData", Style: { width: 84 } },
    { ...GetButton("BackToLast", "返回", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 } }]
}

function GetProperties() {
    return [
        { ...GetEditSelect("ProductId", "产品名称", GetProductDataSource(), 1, 1, false, "请选择产品"), ListName: "loanProductList" },
        GetTextBox4("ProductPeriod", "产品期限", 2, 1, "int", "请输入产品期限", 3, false, ProductRate.PeriodUnitDataSource, "loanPeriodUnit", "03"),
        GetTextBox3("YearRate", "年化利率", 3, 1, "float", "请输入年化利率", 6, false, "%", 0, 100),
        GetTextArea("Remark", "描述", 4, 1),
        GetButtonView()
    ]
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, null, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsNullable,
        IsEdit: true,
        ServiceDataSource: DataSource,
        PlaceHolder: PlaceHolder
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
        Properties: AssignProporties({Name:"ProductRateEdit"}, GetButtonProperties())
    }
}

function GetTextArea(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsEdit: true,
        ColSpan: 24,
        Rows: 3,
        IsAddOptional: true,
        LabelCol: 8,
        WrapperCol: 10
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength || 50),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsNullable,
        AddonAfter: addonAfter,
        IsEdit: true
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/CommonConfig/ProductRateConfig"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "ProductRateEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "ProductRateEdit2"
    }]
}

function GetProductDataSource() {
    return {
        ValueName: "productId",
        TextName: "productName",
        StateName: "ProductList",
        ServiceName: "ProductService",
        ActionName: "GetDataList",
        IsRefresh: true,
        Payload: {
            pageRequest: {
                pageNum: 1,
                pageSize: 1000
            }
        }
    }
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter, MinValue, MaxValue) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType, MinValue, MaxValue
    }
}

function GetTextBox4(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter, PropertyName2, DefaultValue2) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, ""),
        AddonAfterDataSource: addonAfter,
        PropertyName2,
        DefaultValue2,
        DataType,
        SelectStyle: { width: 80 }
    }
}