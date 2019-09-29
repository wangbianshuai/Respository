const Blacklist =require( "../../entities/Blacklist");
const { AssignProporties, GetTextBox, GetRadio, GetButton, RegExpress } =require( "../../Common");

//客户管理/黑名单编辑 3500-3599
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3500,
    //保存实体数据
    SaveEntityData: 3501
}

module.exports= {
    Name: "BlacklistEdit",
    Type: "View",
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"BlacklistEdit"}, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "BlacklistEdit2",
        Type: "RowsColsView",
        Entity: Blacklist,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(Blacklist, GetProperties())
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
        GetUserType(),
        GetTextBox2("Name", "姓名", 2, 1, "", "请输入姓名", 50, false),
        GetTextBox2("IdNumber", "身份证号", 3, 1, "", "请输入身份证号", 20, false, true, ["ValidateIdentityCard"], "身份证号格式不正确！"),
        GetTextBox2("CompanyName", "企业名称", 2, 1, "", "请输入公司名称", 50, false, false, ["ValidateCompanyName"]),
        GetTextBox2("CompanyIdNumber", "统一社会信用代码", 3, 1, "", "请输入统一社会信用代码", 20, false, false),
        GetNumberTextBox("Phone", "手机号码", 4, 1, "请输入手机号码", 11, false, ["ValidateMobile"], "手机号码格式不正确！"),
        GetTextArea("Remark", "备注", 5, 1),
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
        X: 6,
        Y: 1,
        Properties: AssignProporties({Name:"BlacklistEdit"}, GetButtonProperties())
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
        LabelCol: 8,
        WrapperCol: 8
    }
}

function GetUserType() {
    return {
        ...GetRadio("UserType", "用户类型", GetUserTypeDataSource(), 1, 1, "01", 160),
        IsFormItem: true,
        ColSpan: 24,
        IsLoadValue: true,
        LabelCol: 8,
        WrapperCol: 8,
        ValueVisibleProperties: { "01": ["Name", "IdNumber"], "02": ["CompanyName", "CompanyIdNumber"] },
        IsEdit: true
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
        PageUrl: "/Customer/BlacklistManage"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "BlacklistEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "BlacklistEdit2"
    }]
}

/*借款人类型	01	个人
	02	企业*/
function GetUserTypeDataSource() {
    return [{ Value: "01", Text: "个人" }, { Value: "02", Text: "企业" }]
}

function GetNumberTextBox(Name, Label, X, Y, PlaceHolder, MaxLength, IsNullable, ValidateNames, ValidateTipMessage) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, true, ValidateNames, ValidateTipMessage),
        RegExp: RegExpress.NoNumber,
        KeyPressRegExp: RegExpress.InputNumber
    }
}
