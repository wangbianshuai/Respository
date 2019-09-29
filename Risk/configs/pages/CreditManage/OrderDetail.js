const { AssignProporties, GetButton } =require( "../../Common");
const OrderBaseInfo =require( "../../views/Order/BaseInfo");
const PersonCardInfo =require( "../../views/Order/PersonCardInfo");
const PersonBaseInfo =require( "../../views/Order/PersonBaseInfo");
const CompanyBaseInfo =require( "../../views/Order/CompanyBaseInfo");
const PersonPropertyInfo =require( "../../views/Order/PersonPropertyInfo");
const ContactInfo =require( "../../views/Order/ContactInfo");
const Order =require( "../../entities/Order");

//进件管理/进件详情 800-899
const DataActionTypes = {
    //获取订单详情实体数据
    GetOrderDetailEntityData: 800,
    //保存订单详情实体数据
    SaveOrderDetailEntityData: 801,
    //提交进件
    SubmitOrderInfo: 804,
    //获取工单状态
    GetOrderStatus: 805
}

module.exports= {
    Name: "OrderDetail",
    Type: "View",
    EventActions: GetEventActions(),
    Entity: Order,
    EventActionName: "GetOrderDetailEntityData",
    GetEntityDataActionType: DataActionTypes.GetOrderDetailEntityData,
    Properties: AssignProporties({Name:"OrderDetail"}, [OrderBaseInfo(DataActionTypes),
    PersonCardInfo(DataActionTypes), PersonBaseInfo(DataActionTypes), CompanyBaseInfo(DataActionTypes),
    PersonPropertyInfo(DataActionTypes), ContactInfo(DataActionTypes), GetAttachmentView(), GetSubmitButtonView()])
}

function GetSubmitButtonView() {
    return {
        Name: "SubmitRightButtonView",
        Type: "View",
        ClassName: "DivRightButton2",
        IsDiv: true,
        SaveEntityDataActionType: DataActionTypes.SubmitOrderInfo,
        Properties: AssignProporties({Name:"OrderDetail"}, GetRightButtonProperties())
    }
}

function GetRightButtonProperties() {
    return [{ ...GetButton("SubmitOrderInfo", "提交进件", "primary"), ConfirmTip: "请确认是否提交？", IsDisabled: true, EventActionName: "SubmitOrderInfo", Style: { marginRight: 36, width: 110 } }]
}

function GetAttachmentView() {
    return {
        Name: "AttachmentView",
        Type: "View",
        IsDiv: true,
        ClassName: "DivLeftRightView",
        Properties: AssignProporties({Name:"OrderDetail"}, [
            { Name: "LeftRemark", Type: "SpanText", ClassName: "SpanLabel", Text: "附件", Label: "(备注：文件查看、上传、下载跳转至影像文件)" },
            GetAttachmentView2()
        ])
    }
}

function GetAttachmentView2() {
    return {
        Name: "AttachmentView2",
        Type: "View",
        IsDiv: true,
        ClassName: "DivRightButton3",
        PropertyName: "AttachmentInfo",
        Properties: AssignProporties({Name:"OrderDetail"}, [
            { Name: "SpecialOrderRemark", Type: "SpanText", Text: "是否为特殊件" },
            { Name: "isspecial", Type: "CheckBox", Style: { marginRight: 64, marginLeft: 16 }, IsEdit: true, ReadRightName: "SubmitRightButtonView", Label: "是否为特殊件", CheckedValue: "01", UnCheckedValue: "02" },
            { ...GetButton("ToAttachPage", "附件操作", ""), EventActionName: "ToAttachPage", Style: { marginRight: 20 } }
        ])
    }
}

function GetEventActions() {
    return [{
        Name: "AddHouse",
        Type: "DataListView/Add",
        DataListView: "HouseList"
    },
    {
        Name: "DeleteHouse",
        Type: "DataListView/Remove",
        DataListView: "HouseList"
    },
    {
        Name: "AddCar",
        Type: "DataListView/Add",
        DataListView: "CarList"
    },
    {
        Name: "DeleteCar",
        Type: "DataListView/Remove",
        DataListView: "CarList"
    },
    {
        Name: "SubmitOrderInfo",
        Type: "EntityEdit/SaveEntityDataViews",
        EditView: "SubmitRightButtonView",
        EditPropertiyViewList: ["SubmitRightButtonView", "AttachmentView2"],
        SetDisabledViewList: ["SubmitRightButtonView", "AttachmentView2"]
    },
    {
        Name: "SaveOrderInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "OrderInfo"
    },
    {
        Name: "ToAttachPage",
        Type: "Page/ToAttachPage",
        DirType:-1 //表示进件详情
    },
    {
        Name: "SavePersonCardInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PersonCardInfo2"
    },
    {
        Name: "SavePersonBaseInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PersonBaseInfo2"
    },
    {
        Name: "SaveCompanyBaseInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "CompanyBaseInfo2"
    },
    {
        Name: "SavePersonPropertyInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "PersonPropertyInfo2"
    },
    {
        Name: "SaveContactInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "ContactInfo2"
    },
    {
        Name: "GetOrderDetailEntityData",
        Type: "EntityEdit/GetEntityData",
        EditView: "OrderDetail",
        EditPropertiyViewList: ["OrderInfo", "AttachmentView2", "PersonCardInfo2", "PersonBaseInfo2", "CompanyBaseInfo2", "PersonPropertyInfo2", "ContactInfo2"]
    }]
}