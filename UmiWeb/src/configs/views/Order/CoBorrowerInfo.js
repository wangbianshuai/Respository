import { AssignProporties, GetTextBox, GetButton, GetSelect, CreateGuid } from "../../pages/Common";

export default {
    Name: "CoBorrowerInfo",
    Type: "View",
    Properties: AssignProporties({}, [GetInfoView(), GetRightButtonView()])
}

function GetInfoView() {
    return {
        Name: "CoBorrowerInfo2",
        Type: "View",
        Title: "共借人信息",
        Style: { marginTop: 8 },
        Properties: AssignProporties({}, [GetCoBorrowerProperties()])
    }
}

function GetCoBorrowerProperties() {
    return {
        Name: "CoBorrowerList",
        Type: "DataListView",
        DefaultValue: [{ Id: CreateGuid(), Title: "共同借款人一" }],
        IsComplexEdit: true,
        IsFirstDelete: false,
        DeletePropertyName: "DeleteCoBorrower",
        PrimaryKey: "Id",
        Title: "共同借款人",
        Properties: AssignProporties({}, [{
            Name: "CoBorrowerItemView",
            Type: "RowsColsView",
            IsForm: true,
            LabelAlign: "left",
            IsDiv: false,
            Properties: AssignProporties({}, GetBankItemProperties())
        }])
    }
}

function GetRightButtonView() {
    return {
        Name: "RightButtonView",
        Type: "View",
        ClassName: "DivRightButton",
        IsDiv: true,
        Properties: AssignProporties({}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("AddCoBorrower", "新增", ""), EventActionName: "AddCoBorrower", Style: { marginRight: 10 }, Icon: "plus" },
    { ...GetButton("SaveCoBorrowerInfo", "保存", "primary"), EventActionName: "SaveCoBorrowerInfo", Style: { marginRight: 36, width: 84 } }]
}

function GetBankItemProperties() {
    return [
        { Name: "Title", Type: "SpanText", X: 1, Y: 1, ClassName: "SpanTitle" },
        { ...GetButton("DeleteCoBorrower", "删除", "", 1, 2), EventActionName: "DeleteCoBorrower", Style: { marginLeft: 20, marginBottom: 10 }, Icon: "delete" },
        GetEditSelect("CarUseNature", "用户类型", GetUserTypeDataSource(), 2, 1, false, "请选择用户类型"),
        GetTextBox2("HouserAddress", "姓名/企业名称", 2, 2, "", "请输入姓名/企业名称", 50, false),
        GetTextBox3("HoustSpace", "身份证号/统一社会信用代码", 2, 3, "", "请输入身份证号/统一社会信用代码", 50, false),
        GetTextBox3("HoustSpace", "联系方式", 3, 1, "", "请输入联系方式", 50, false),
        GetTextBox3("HoustSpace", "邮箱", 3, 2, "", "请输入邮箱", 50, false),
        GetEditSelect("CarUseNature", "担保主体", GetCautionerTypeDataSource(), 3, 3, false, "请选择担保主体"),
        GetEditSelect("CarUseNature", "与借款主体关系", GetLoanRelationDataSource(), 4, 1, false, "请选择与借款主体关系"),
    ]
}


function GetEditSelect(Name, Label, DataSource, X, Y, IsNullable, PlaceHolder, DefaultValue) {
    return {
        ...GetSelect(Name, Label, DataSource, X, Y, DefaultValue),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 20,
        WrapperCol: 20,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        PlaceHolder: PlaceHolder,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetTextBox3(Name, Label, X, Y, DataType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox2(Name, Label, X, Y, "", PlaceHolder, MaxLength, IsNullable, addonAfter),
        DataType
    }
}

function GetTextBox2(Name, Label, X, Y, ContorlType, PlaceHolder, MaxLength, IsNullable, addonAfter) {
    return {
        ...GetTextBox(Name, Label, ContorlType, X, Y, PlaceHolder, MaxLength),
        IsColon: false,
        IsFormItem: true, ColSpan: 8,
        LabelCol: 10,
        WrapperCol: 20,
        AddonAfter: addonAfter,
        IsNullable: IsNullable,
        IsAddOptional: !!IsNullable,
        IsEdit: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetUserTypeDataSource() {
    return [{ Value: 1, Text: "个人" }, { Value: 0, Text: "单位" }]
}

function GetCautionerTypeDataSource() {
    return [{ Value: 1, Text: "个人" }, { Value: 0, Text: "单位" }]
}

function GetLoanRelationDataSource(){
    return [{ Value: 1, Text: "个人" }, { Value: 0, Text: "单位" }]
}