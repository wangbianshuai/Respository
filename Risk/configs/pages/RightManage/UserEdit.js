const User =require( "../../entities/User");
const { AssignProporties, GetTextBox, GetButton } =require( "../../Common");

//权限管理/用户编辑 3900-3999
const DataActionTypes = {
    //保存实体数据
    SaveEntityData: 3901
}

module.exports= {
    Name: "UserEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"UserEdit"}, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "UserEdit2",
        Type: "RowsColsView",
        Entity: User,
        IsForm: true,
        IsClear: true,
        EventActionName: "GetEntityData",
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        Properties: AssignProporties(User, GetProperties())
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
        GetSelectUserView(),
        GetReadOnlyTextBox2("depStr", "部门", 2, 1),
        GetReadOnlyTextBox2("position", "职位", 3, 1),
        GetButtonView()
    ]
}

function GetSelectUserView() {
    return {
        Name: "SelectUser",
        Type: "AutoComplete",
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsEdit: true,
        Label: "检索",
        IsNullable: false,
        X: 1,
        Y: 1,
        IsLoadValue: true,
        PlaceHolder: "请输入员工姓名或员工编号关键字",
        SelectDataToProperties: ["depStr", "position"],
        ExpandSetDataList: "SetSelectUserDataList",
        ServiceDataSource: GetUserDataSource()
    }
}

function GetUserDataSource() {
    return {
        ValueName: "UserName",
        TextName: "UserName",
        StateName: "EmployeeList",
        ServiceName: "EmployeeService",
        ActionName: "GetEmployeeList",
        IsRefresh: true,
        Payload: {}
    }
}


function GetButtonView() {
    return {
        Name: "ButtonView",
        Type: "View",
        ClassName: "DivCenterButton",
        IsDiv: true,
        IsFormItem: true,
        IsAddOptional: true,
        ColSpan: 24,
        X: 6,
        Y: 1,
        Properties: AssignProporties({Name:"UserEdit"}, GetButtonProperties())
    }
}

function GetReadOnlyTextBox2(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "", X, Y),
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsReadOnly: true,
        IsEdit: true
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/RightManage/UserManage"
    },
    {
        Name: "SaveEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "UserEdit2"
    }]
}