import Product from "../../entities/Product";
import { AssignProporties, GetTextBox, GetSelect, GetButton } from "../Common";

//公共配置/产品编辑 3300-3399
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3300,
    //保存实体数据
    SaveEntityData: 3301
}

export default {
    Name: "ProductEdit",
    Type: "View",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "ProductEdit2",
        Type: "RowsColsView",
        Entity: Product,
        IsForm: true,
        EventActionName: "GetEntityData",
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties({}, GetProperties())
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
        GetEditSelect("ProductType", "产品大类", GetProductDataSource(), 1, 1, false, "请选择产品大类"),
        GetTextBox2("ProductName", "产品名称", 2, 1, "", "请输入产品名称", 50, false),
        GetTextBox2("ProductCode", "产品代码", 3, 1, "", "请输入产品代码", 20, false),
        GeLoanAmountView(),
        GetBackMethods(),
        GetTextArea("Remark", "描述", 6, 1),
        GetButtonView()
    ]
}

function GetBackMethods() {
    return {
        Name: "BackMethods",
        Type: "CheckBoxGroup",
        DataSource: GetBackMethodsDataSource(),
        Label: "还款方式（多选）",
        IsFormItem: true,
        ColSpan: 24,
        X: 5,
        Y: 1,
        LabelCol: 8,
        WrapperCol: 10,
        IsNullable: false,
        DataType: "Array",
        NullTipMessage: "请选择还款方式",
        IsEdit: true,
    }
}

function GetBackMethodsDataSource() {
    return [{ Value: "1", Text: "等额本息" }, { Value: "2", Text: "先息后本" }]
}

function GeLoanAmountView() {
    return {
        Name: "LoanAmount",
        Type: "RowsColsView",
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsEdit: true,
        Label: "借款额度范围",
        IsDiv: false,
        IsView: true,
        IsNullable: false,
        X: 4,
        Y: 1,
        Style: {
            marginBottom: 0
        },
        Properties: AssignProporties({}, GetLoanAmountProperties())
    }
}

function GetLoanAmountProperties() {
    return [
        GetTextBox3("MinLoanAmount", "", 1, 1, "float", "请输入最小借款额度", 20, false, "元"),
        { Name: "Space1", Type: "SpanText", X: 1, Y: 2, Text: "-", ColSpan: 2, Style: { textAlign: "center", display: "block" } },
        GetTextBox3("MaxLoanAmount", "", 1, 3, "float", "请输入最大借款额度", 20, false, "元"),
    ]
}

function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsNullable,
        IsEdit: true,
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
        X: 7,
        Y: 1,
        Properties: AssignProporties({}, GetButtonProperties())
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
        PageUrl: "/CommonConfig/ProductConfig"
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

function GetProductDataSource() {
    return [{ Value: "1", Text: "新商贷" }, { Value: "2", Text: "新车贷" }]
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType,
        ColSpan: 11,
        NullTipMessage: PlaceHolder
    }
}