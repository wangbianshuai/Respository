const BackMethod =require( "../../entities/BackMethod");
const { AssignProporties, GetTextBox, GetSelect, GetButton } =require( "../../Common");

//公共配置/还款方式编辑 2900-2999
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2900,
    //保存实体数据
    SaveEntityData: 2901
}

module.exports= {
    Name: "BackMethodEdit",
    Type: "View",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"BackMethodEdit"}, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "BackMethodEdit2",
        Type: "RowsColsView",
        Entity: BackMethod,
        IsForm: true,
        IsClear: true,
        EventActionName: "GetEntityData",
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(BackMethod, GetProperties())
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
        GetTextBox2("Name", "名称", 1, 1, "", "请输入名称", 50, false),
        { ...GetEditSelect("MethodType", "还款方式", GetMethodTypeDataSource(), 2, 1, false, "请选择还款方式"), IsLoadValue: true },
        { IsReadOnly: false, ...GetTextBox4("PeriodMethod", "分期方式", 3, 1, "int", "", 3, false, BackMethod.PeriodUnitDataSource, "periodWayUnit", "03") },
        GetEditSelect("YearRateMethod", "年化计算方式", GetYearRateMethodDataSource(), 4, 1, false, "请选择年化计算方式"),
        GetTextArea("Remark", "描述", 5, 1),
        GetButtonView()
    ]
}

/*
年化计算方式	01	360
	02	365(闰年366)*/
function GetYearRateMethodDataSource() {
    return [{ Value: "01", Text: "360" }, { Value: "02", Text: "365(闰年366)" }]
}

/*还款方式	01	等额本息
	02	付息还本*/
function GetMethodTypeDataSource() {
    return [{ Value: "01", Text: "等额本息" }, { Value: "02", Text: "付息还本" }]
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
        X: 6,
        Y: 1,
        Properties: AssignProporties({Name:"BackMethodEdit"}, GetButtonProperties())
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
        PageUrl: "/CommonConfig/BackMethodConfig"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "BackMethodEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "BackMethodEdit2"
    }]
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