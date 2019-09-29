const Employee =require( "../../entities/Employee");
const { AssignProporties, GetTextBox } =require( "../../Common");

//个人中心/基本信息 2600-2699
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 2600
}

module.exports= {
    Name: "BaseInfo",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({Name:"BaseInfo"}, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "UserEdit2",
        Type: "RowsColsView",
        IsForm: true,
        LabelAlign: "left",
        EventActionName: "GetEntityData",
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(Employee, GetProperties())
    }
}

function GetProperties() {
    return [{
        Name: "BaseTitle", Type: "SpanText", X: 1, Y: 1, Text: "基本信息", ClassName: "SpanTitle", Style: { fontSize: 20, marginBottom: 16 }
    },
    GetReadOnlyTextBox2("Email", "邮箱", 2, 1),
    GetReadOnlyTextBox2("UserName", "姓名", 3, 1),
    GetReadOnlyTextBox2("Phone", "手机号码", 4, 1),
    GetReadOnlyTextBox2("DepartName", "部门", 5, 1),
    GetReadOnlyTextBox2("JobName", "职位", 6, 1),
    GetReadOnlyTextBox2("UserCode", "员工编号", 7, 1)
    ]
}

function GetReadOnlyTextBox2(Name, Label, X, Y) {
    return {
        ...GetTextBox(Name, Label, "", X, Y),
        IsFormItem: true,
        ColSpan: 10,
        LabelCol: 6,
        WrapperCol: 24,
        IsColon: false,
        IsReadOnly: true,
        Style: {
            display: "flex",
            flexDirection: "column",
            marginBottom: 10
        }
    }
}

function GetEventActions() {
    return [{
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "UserEdit2",
        SetRequestEntityData: "SetGetEmployeeInfo"
    }]
}