import { AssignProporties, GetButton } from "../Common";
import OrderBaseInfo from "../../views/Order/BaseInfo";
import PersonCardInfo from "../../views/Order/PersonCardInfo";
import PersonBaseInfo from "../../views/Order/PersonBaseInfo";
import CompanyBaseInfo from "../../views/Order/CompanyBaseInfo";
import PersonPropertyInfo from "../../views/Order/PersonPropertyInfo";
import ContactInfo from "../../views/Order/ContactInfo";
import Order from "../../entities/Order";

import DataActions from "Actions";

//进件管理/进件详情 800-899
const DataActionTypes = DataActions.GetActionTypes("CreditManage_OrderDetail");

export default {
    Name: "OrderDetail",
    Type: "View",
    EventActions: GetEventActions(),
    Entity: Order,
    EventActionName: "GetOrderDetailEntityData",
    GetEntityDataActionType: DataActionTypes.GetOrderDetailEntityData,
    Properties: AssignProporties({}, [OrderBaseInfo(DataActionTypes),
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
        Properties: AssignProporties({}, GetRightButtonProperties())
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
        Properties: AssignProporties({}, [
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
        Properties: AssignProporties({}, [
            { Name: "SpecialOrderRemark", Type: "SpanText", ClassName: "SpecialOrderRemark" },
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
        Type: "EntityEdit/SaveEntityData",
        EditView: "SubmitRightButtonView",
        SetDisabledViewList: ["SubmitRightButtonView"]
    },
    {
        Name: "SaveOrderInfoEntityData",
        Type: "EntityEdit/SaveEntityData",
        EditView: "OrderInfo"
    },
    {
        Name: "ToAttachPage",
        Type: "Page/ToAttachPage"
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