import User from "../../entities/User";
import { AssignProporties, GetTextBox, GetButton } from "../Common";
import SelectUserView from "./SelectUserView";

//权限管理/用户编辑 3900-3999
const DataActionTypes = {
    //获取实体数据
    GetEntityData: 3900,
    //保存实体数据
    SaveEntityData: 3901
}

export default {
    Name: "UserEdit",
    Type: "View",
    DialogViews: [SelectUserView],
    GetEntityData: DataActionTypes.GetEntityData,
    EventActions: GetEventActions(),
    Properties: AssignProporties({}, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "UserEdit2",
        Type: "RowsColsView",
        Entity: User,
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
        GetSelectUserView(),
        GetReadOnlyTextBox2("DepartName", "部门", 2, 1),
        GetReadOnlyTextBox2("JobName", "职位", 3, 1),
        GetButtonView()
    ]
}

function GetSelectUserView() {
    return {
        Name: "SelectUserView",
        Type: "RowsColsView",
        IsFormItem: true,
        ColSpan: 24,
        LabelCol: 8,
        WrapperCol: 10,
        IsEdit: true,
        Label: "姓名",
        IsDiv: false,
        IsView: true,
        IsNullable: false,
        X: 1,
        Y: 1,
        Style: {
            marginBottom: 0
        },
        Properties: AssignProporties({}, GetLoanAmountProperties())
    }
}

function GetLoanAmountProperties() {
    return [
        GetReadOnlyTextBox3("UserName", "", 1, 1, "请选择用户"),
        { ...GetButton("SelectUser", "选择", "default", 1, 2), ColSpan: 4, EventActionName: "SelectUser" },
    ]
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
        Properties: AssignProporties({}, GetButtonProperties())
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

function GetReadOnlyTextBox3(Name, Label, X, Y, NullTipMessage) {
    return {
        ...GetTextBox(Name, Label, "", X, Y),
        IsFormItem: true,
        ColSpan: 20,
        IsReadOnly: true,
        NullTipMessage,
        IsNullable: false,
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
    },
    {
        Name: "SearchQuery",
        Type: "DataGridView/SearchQuery",
        SearchView: "SearchOperationView1",
        SearchButton: "Keyword",
        DataGridView: "DataGridView1",
        AlertMessage: "AlertMessage"
    },
    {
        Name: "SelectUser",
        Type: "Dialog/SearchQueryDataSelectRowData",
        DialogView: "SelectUserView",
        DataGridView: "DataGridView1",
        ToSetView: "UserEdit2"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "UserEdit2"
    }]
}