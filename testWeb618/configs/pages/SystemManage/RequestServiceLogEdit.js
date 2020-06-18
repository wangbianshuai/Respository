const RequestServiceLog = require("../../entities/RequestServiceLog");
const { AssignProporties, GetTextBox, GetButton } = require("../../Common");

//MessageManage/RequestServiceLogEdit 500-599
const DataActionTypes = {
    //Get Entity Data
    GetEntityData: 500,
}

const Entity = {
    Name: RequestServiceLog.Name, PrimaryKey: RequestServiceLog.PrimaryKey, ExpandMethods: {
        GetEntityData: "GetEntityData"
    }
}

module.exports = {
    Name: "RequestServiceLogEdit",
    Type: "View",
    EventActions: GetEventActions(),
    Properties: AssignProporties({ Name: "RequestServiceLogEdit" }, [GeEditView()])
}

function GeEditView() {
    return {
        Name: "RequestServiceLogEdit2",
        Type: "RowsColsView",
        Entity: Entity,
        IsForm: true,
        EventActionName: "GetEntityData",
        IsClear: true,
        SaveEntityDataActionType: DataActionTypes.SaveEntityData,
        GetEntityDataActionType: DataActionTypes.GetEntityData,
        Properties: AssignProporties(RequestServiceLog, GetProperties())
    }
}

function GetButtonProperties() {
    return [{
        Name: "LeftSpace1",
        Type: "WhiteSpace",
        ClassName: "ant-col ant-col-8 ant-form-item-label"
    },
    { ...GetButton("BackToLast", "返回", ""), EventActionName: "BackToLast", Style: { marginLeft: 10 } }]
}

function GetProperties() {
    return [
        GetTextBox2("LogTypeName", "日志类型", 1, 1),
        GetTextBox2("ServiceInterfaceName", "服务接口", 2, 1),
        GetTextBox2("ReSendCount", "重发次数", 3, 1),
        GetTextBox2("IsReSendName", "是否重发", 4, 1),
        GetTextBox2("StartTime", "开始时间", 5, 1),
        GetTextBox2("EndTime", "结束时间", 6, 1),
        GetTextBox2("ElapsedMilliseconds", "耗时(毫秒)", 7, 1),
        GetTextArea("RequestContent", "请求报文", 8, 1),
        GetTextArea("ResponseContent", "响应报文", 9, 1),
        GetButtonView()
    ]
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
        IsReadOnly: true,
        IsEdit: true
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
        X: 10,
        Y: 1,
        Properties: AssignProporties({ Name: "RequestServiceLogEdit" }, GetButtonProperties())
    }
}

function GetTextArea(Name, Label, X, Y, PlaceHolder) {
    return {
        ...GetTextBox(Name, Label, "TextArea", X, Y),
        IsFormItem: true,
        IsNullable: true,
        IsEdit: true,
        ColSpan: 24,
        Rows: 6,
        IsReadOnly: true,
        PlaceHolder,
        LabelCol: 8,
        WrapperCol: 8
    }
}

function GetEventActions() {
    return [{
        Name: "BackToLast",
        Type: "Page/ToPage",
        PageUrl: "/SystemManage/RequestServiceLogList",
        ExpandSetPageUrl: "ExpandSetPageUrl"
    },
    {
        Name: "GetEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "RequestServiceLogEdit2"
    }]
}